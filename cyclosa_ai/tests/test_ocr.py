import io
import base64
import numpy as np
from PIL import Image
from app.modules.ocr.schemas import (
    DocumentQualityCheckRequest,
    OcrExtractRequest
)
from app.modules.ocr.router import (
    check_document_quality,
    extract_document_data
)


def _create_test_image_b64(width: int, height: int, is_blurry: bool = False) -> str:
    """Tạo ảnh thử nghiệm với kích thước và độ sắc nét tùy chỉnh"""
    if is_blurry:
        # Ảnh xám trơn ít texture (Laplacian variance thấp)
        arr = np.full((height, width, 3), 128, dtype=np.uint8)
    else:
        # Ảnh có cạnh viền sắc nét và text/noise
        arr = np.zeros((height, width, 3), dtype=np.uint8)
        arr[::20, :, :] = 255
        arr[:, ::20, :] = 255

    img = Image.fromarray(arr)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return base64.b64encode(buf.getvalue()).decode("utf-8")


def test_quality_check_high_res_valid():
    """Kiểm tra ảnh chuẩn A4 300 DPI (2480 x 3508)"""
    img_b64 = _create_test_image_b64(2480, 3508, is_blurry=False)
    req = DocumentQualityCheckRequest(file_base64=img_b64)
    res = check_document_quality(req)
    assert res.success is True
    assert res.data.is_dpi_valid is True
    assert res.data.dpi >= 290
    assert res.data.quality_status == "VALID"


def test_quality_check_low_dpi_rejected():
    """Kiểm tra ảnh độ phân giải thấp (800 x 600) bị từ chối theo TT 05"""
    img_b64 = _create_test_image_b64(800, 600, is_blurry=False)
    req = DocumentQualityCheckRequest(file_base64=img_b64)
    res = check_document_quality(req)
    assert res.success is True
    assert res.data.is_dpi_valid is False
    assert res.data.quality_status in ("REJECTED_LOW_RES", "WARNING_BLURRY")


def test_ocr_extract_cccd():
    """Bóc tách dữ liệu CCCD hợp lệ"""
    sample_cccd_text = """
    CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
    Độc lập - Tự do - Hạnh phúc
    CĂN CƯỚC CÔNG DÂN
    Số / No.: 001099012345
    Họ và tên / Full name: NGUYỄN VĂN HÙNG
    Ngày sinh / Date of birth: 15/08/1995
    Giới tính / Sex: NAM  Quốc tịch / Nationality: Việt Nam
    Quê quán / Place of origin: Ba Đình, Hà Nội
    Nơi thường trú / Place of residence: Cầu Giấy, Hà Nội
    Có giá trị đến / Date of expiry: 15/08/2035
    """
    req = OcrExtractRequest(
        raw_text=sample_cccd_text,
        document_type="CCCD"
    )
    res = extract_document_data(req)
    assert res.success is True
    assert res.data.document_type == "CCCD"
    assert res.data.extracted_fields.get("id_number") == "001099012345"
    assert res.data.field_confidences.get("id_number") >= 0.95
    assert res.data.extracted_fields.get("date_of_birth") == "1995-08-15"


def test_ocr_extract_diploma():
    """Bóc tách dữ liệu Bằng đại học"""
    sample_diploma_text = """
    BỘ GIÁO DỤC VÀ ĐÀO TẠO
    TRƯỜNG ĐẠI HỌC BÁCH KHOA HÀ NỘI
    BẰNG TỐT NGHIỆP ĐẠI HỌC
    Cấp cho: NGUYỄN VĂN HÙNG
    Sinh ngày: 15/08/1995
    Ngành đào tạo: KHOA HỌC MÁY TÍNH
    Năm tốt nghiệp: 2018
    Xếp loại tốt nghiệp: GIỎI
    Số hiệu văn bằng: BK-2018-9988
    """
    req = OcrExtractRequest(
        raw_text=sample_diploma_text,
        document_type="DIPLOMA"
    )
    res = extract_document_data(req)
    assert res.success is True
    assert res.data.document_type == "DIPLOMA"
    assert res.data.extracted_fields.get("graduation_year") == 2018
    assert res.data.overall_confidence > 0.60


def test_ocr_extract_labor_contract():
    """Bóc tách dữ liệu Hợp đồng lao động"""
    sample_contract_text = """
    CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
    HỢP ĐỒNG LAO ĐỘNG
    Số: HĐLĐ-2026/088
    Bên A (Người sử dụng lao động): TẬP ĐOÀN CÔNG NGHỆ CYCLOSA
    Bên B (Người lao động): NGUYỄN VĂN HÙNG
    Vị trí: Kỹ sư Phần mềm Cao cấp
    Thời hạn hợp đồng: Không xác định thời hạn
    Mức lương cơ bản: 35.000.000 VNĐ
    Ngày bắt đầu làm việc: 01/01/2026
    """
    req = OcrExtractRequest(
        raw_text=sample_contract_text,
        document_type="LABOR_CONTRACT"
    )
    res = extract_document_data(req)
    assert res.success is True
    assert res.data.document_type == "LABOR_CONTRACT"


def test_ocr_extract_vague_text_triggers_review():
    """Văn bản mờ nhạt không rõ số CCCD kích hoạt cảnh báo đối soát thủ công"""
    vague_text = "Ảnh chụp quá mờ không đọc được chữ số nào..."
    req = OcrExtractRequest(
        raw_text=vague_text,
        document_type="CCCD"
    )
    res = extract_document_data(req)
    assert res.success is True
    assert res.data.needs_manual_review is True
    assert len(res.data.review_reasons) > 0
