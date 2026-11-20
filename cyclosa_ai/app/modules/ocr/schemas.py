from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field
from app.common.schemas.response import ApiResponse


# ==========================================
# 1. Quality Check Schemas (TT 05/2025/TT-BNV)
# ==========================================

class DocumentQualityCheckRequest(BaseModel):
    file_url: Optional[str] = Field(None, description="Đường dẫn URL của tệp tài liệu (Cloudinary/S3)")
    file_base64: Optional[str] = Field(None, description="Dữ liệu tệp mã hóa Base64")
    file_name: Optional[str] = Field("document.pdf", description="Tên tệp gốc kèm phần mở rộng")


class DocumentQualityCheckResult(BaseModel):
    dpi: int = Field(..., description="Chỉ số độ phân giải DPI tính toán được")
    is_dpi_valid: bool = Field(..., description="DPI có đạt chuẩn Thông tư 05/2025/TT-BNV (>= 300 DPI) không")
    is_blurry: bool = Field(..., description="Tệp có bị mờ/nhòe không đạt chất lượng hay không")
    blur_score: float = Field(..., description="Điểm đo độ sắc nét (Laplacian variance)")
    skew_angle: float = Field(0.0, description="Góc nghiêng phát hiện được (độ)")
    is_deskewed: bool = Field(False, description="Tài liệu đã được khử nghiêng tự động hay chưa")
    quality_status: str = Field(..., description="VALID | WARNING_BLURRY | REJECTED_LOW_RES")
    details: str = Field(..., description="Báo cáo chi tiết thẩm định chất lượng tệp số hóa")


class DocumentQualityCheckResponse(ApiResponse[DocumentQualityCheckResult]):
    pass


# ==========================================
# 2. OCR Extraction Schemas
# ==========================================

class OcrExtractRequest(BaseModel):
    file_url: Optional[str] = Field(None, description="URL tài liệu cần trích xuất")
    file_base64: Optional[str] = Field(None, description="Tệp tài liệu dạng Base64")
    raw_text: Optional[str] = Field(None, description="Văn bản đã trích xuất sẵn nếu có")
    document_type: str = Field("GENERAL_DOC", description="Loại hồ sơ: CCCD, DIPLOMA, LABOR_CONTRACT, HEALTH_CERT, GENERAL_DOC")
    employee_id: Optional[str] = Field(None, description="Mã nhân viên sở hữu hồ sơ")
    document_id: Optional[str] = Field(None, description="Mã tài liệu số hóa trong kho")


class CccdExtractedData(BaseModel):
    id_number: Optional[str] = Field(None, description="Số định danh cá nhân / CCCD (12 số)")
    full_name: Optional[str] = Field(None, description="Họ và tên đầy đủ")
    date_of_birth: Optional[str] = Field(None, description="Ngày sinh định dạng YYYY-MM-DD")
    gender: Optional[str] = Field(None, description="Giới tính: NAM / NỮ")
    nationality: Optional[str] = Field("Việt Nam", description="Quốc tịch")
    place_of_origin: Optional[str] = Field(None, description="Quê quán")
    place_of_residence: Optional[str] = Field(None, description="Nơi thường trú")
    issue_date: Optional[str] = Field(None, description="Ngày cấp YYYY-MM-DD")
    expiry_date: Optional[str] = Field(None, description="Có giá trị đến YYYY-MM-DD")
    issue_place: Optional[str] = Field(None, description="Cơ quan cấp")


class DiplomaExtractedData(BaseModel):
    school_name: Optional[str] = Field(None, description="Tên cơ sở giáo dục / Trường đại học")
    major: Optional[str] = Field(None, description="Ngành đào tạo / Chuyên ngành")
    degree_level: Optional[str] = Field(None, description="Trình độ: Cử nhân, Kỹ sư, Thạc sĩ, Tiến sĩ")
    ranking: Optional[str] = Field(None, description="Xếp loại tốt nghiệp: Xuất sắc, Giỏi, Khá, Trung bình")
    graduation_year: Optional[int] = Field(None, description="Năm tốt nghiệp")
    diploma_number: Optional[str] = Field(None, description="Số hiệu văn bằng")
    registration_number: Optional[str] = Field(None, description="Số vào sổ cấp bằng")


class LaborContractExtractedData(BaseModel):
    contract_number: Optional[str] = Field(None, description="Số hợp đồng lao động")
    contract_type: Optional[str] = Field(None, description="Loại hợp đồng: Xác định thời hạn, Không xác định thời hạn...")
    employer_name: Optional[str] = Field(None, description="Đại diện người sử dụng lao động")
    employee_name: Optional[str] = Field(None, description="Họ tên người lao động")
    job_title: Optional[str] = Field(None, description="Vị trí / Chức danh công việc")
    start_date: Optional[str] = Field(None, description="Ngày bắt đầu hiệu lực")
    end_date: Optional[str] = Field(None, description="Ngày hết hiệu lực (nếu có)")
    base_salary: Optional[float] = Field(None, description="Mức lương chính / Mức lương cơ bản (VNĐ)")


class GeneralDocExtractedData(BaseModel):
    document_title: Optional[str] = Field(None, description="Tiêu đề hoặc trích yếu văn bản")
    document_number: Optional[str] = Field(None, description="Số hiệu văn bản")
    issuing_authority: Optional[str] = Field(None, description="Cơ quan / Tổ chức ban hành")
    issue_date: Optional[str] = Field(None, description="Ngày ban hành")
    summary: Optional[str] = Field(None, description="Tóm tắt nội dung chính")


class OcrExtractResult(BaseModel):
    document_type: str = Field(..., description="Loại hồ sơ đã nhận diện và trích xuất")
    raw_text: str = Field(..., description="Toàn bộ văn bản thuần bóc tách từ tài liệu")
    extracted_fields: Dict[str, Any] = Field(default_factory=dict, description="Các trường dữ liệu có cấu trúc")
    field_confidences: Dict[str, float] = Field(default_factory=dict, description="Điểm tin cậy OCR cho từng trường (0.0 -> 1.0)")
    overall_confidence: float = Field(..., description="Điểm tin cậy bình quân của bản ghi OCR (0.0 -> 1.0)")
    needs_manual_review: bool = Field(..., description="Cần chuyên viên HR đối soát thủ công trên màn hình chia đôi")
    review_reasons: List[str] = Field(default_factory=list, description="Lý do cần đối soát nếu điểm tin cậy thấp hoặc nghi ngờ")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Thông số kỹ thuật bóc tách")


class OcrExtractResponse(ApiResponse[OcrExtractResult]):
    pass
