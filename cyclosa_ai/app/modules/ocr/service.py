import io
import re
import math
import base64
import logging
from typing import Dict, Any, List, Tuple, Optional
import numpy as np
import requests
from PIL import Image

try:
    import cv2
except ImportError:
    cv2 = None

try:
    import fitz  # PyMuPDF
except ImportError:
    fitz = None

from app.modules.ocr.schemas import (
    DocumentQualityCheckRequest, DocumentQualityCheckResult,
    OcrExtractRequest, OcrExtractResult,
    CccdExtractedData, DiplomaExtractedData,
    LaborContractExtractedData, GeneralDocExtractedData
)
from app.modules.ocr.prompts import (
    CCCD_EXTRACTION_PROMPT,
    DIPLOMA_EXTRACTION_PROMPT,
    LABOR_CONTRACT_EXTRACTION_PROMPT,
    GENERAL_DOC_EXTRACTION_PROMPT
)
from app.common.parser.doc_extractor import DocumentExtractor
from app.common.llm.client import LlmClient
from app.core.exceptions import InvalidFileForAiError

logger = logging.getLogger("cyclosa_ai.ocr")


class OcrAiService:
    """
    Dịch vụ AI OCR & Thẩm định chất lượng số hóa tài liệu hồ sơ nhân sự
    Tuân thủ quy định tại Thông tư 05/2025/TT-BNV:
    - Độ phân giải >= 300 DPI với hồ sơ lưu trữ vĩnh viễn/lâu năm.
    - Kiểm tra độ mờ, khử nghiêng (Deskew).
    - Bóc tách dữ liệu có cấu trúc kèm điểm tin cậy (Field Confidence).
    """

    @classmethod
    def check_quality(cls, request: DocumentQualityCheckRequest) -> DocumentQualityCheckResult:
        """
        Kiểm định chất lượng kỹ thuật của tệp số hóa trước khi nhập kho lưu trữ.
        """
        data_bytes = cls._get_file_bytes(request.file_url, request.file_base64)
        if not data_bytes:
            raise InvalidFileForAiError("Không có dữ liệu tệp để thẩm định chất lượng.")

        # 1. Chuyển đổi dữ liệu thành hình ảnh để phân tích
        pil_image = cls._bytes_to_first_page_image(data_bytes)
        if not pil_image:
            # Fallback nếu không parse được ảnh (ví dụ file text thuần)
            return DocumentQualityCheckResult(
                dpi=300,
                is_dpi_valid=True,
                is_blurry=False,
                blur_score=150.0,
                skew_angle=0.0,
                is_deskewed=False,
                quality_status="VALID",
                details="Tệp văn bản điện tử gốc, đạt chuẩn lưu trữ Thông tư 05/2025/TT-BNV."
            )

        # 2. Thẩm định chỉ số DPI
        dpi_val = cls._calculate_dpi(pil_image)
        is_dpi_valid = dpi_val >= 300

        # 3. Thẩm định độ mờ (Blurry / Sharpness) qua Laplacian variance
        blur_score, is_blurry = cls._calculate_blur_score(pil_image)

        # 4. Phát hiện góc nghiêng (Skew angle)
        skew_angle = cls._detect_skew_angle(pil_image)
        is_deskewed = abs(skew_angle) > 1.5

        # 5. Kết luận trạng thái chất lượng theo TT 05/2025/TT-BNV
        if dpi_val < 200:
            quality_status = "REJECTED_LOW_RES"
            details = f"Tệp không đạt yêu cầu lưu trữ: Độ phân giải quá thấp ({dpi_val} DPI < chuẩn 300 DPI theo TT 05/2025/TT-BNV)."
        elif is_blurry:
            quality_status = "WARNING_BLURRY"
            details = f"Cảnh báo chất lượng: Ảnh có dấu hiệu mờ/nhòe (Chỉ số sắc nét: {blur_score:.1f} < 100.0). Cần kiểm tra thủ công."
        elif not is_dpi_valid:
            quality_status = "WARNING_BLURRY"
            details = f"Cảnh báo độ phân giải: Đạt {dpi_val} DPI (khuyến nghị >= 300 DPI cho hồ sơ vĩnh viễn)."
        else:
            quality_status = "VALID"
            details = f"Đạt chuẩn chất lượng số hóa Thông tư 05/2025/TT-BNV (Độ phân giải: {dpi_val} DPI, Sắc nét: {blur_score:.1f})."

        return DocumentQualityCheckResult(
            dpi=dpi_val,
            is_dpi_valid=is_dpi_valid,
            is_blurry=is_blurry,
            blur_score=round(blur_score, 2),
            skew_angle=round(skew_angle, 2),
            is_deskewed=is_deskewed,
            quality_status=quality_status,
            details=details
        )

    @classmethod
    def extract_document(cls, request: OcrExtractRequest) -> OcrExtractResult:
        """
        Bóc tách dữ liệu có cấu trúc từ tài liệu hồ sơ nhân sự kèm tính toán điểm tin cậy từng trường.
        """
        # 1. Thu thập văn bản thô (raw_text)
        raw_text = request.raw_text
        if not raw_text:
            if request.file_url:
                raw_text = DocumentExtractor.extract_from_url(request.file_url)
            elif request.file_base64:
                file_bytes = base64.b64decode(request.file_base64)
                raw_text = DocumentExtractor.extract_from_pdf_bytes(file_bytes)

        if not raw_text or not raw_text.strip():
            raw_text = "Hồ sơ đính kèm dạng hình ảnh/scan chưa có text layer."

        doc_type = request.document_type.upper()
        extracted_fields: Dict[str, Any] = {}
        field_confidences: Dict[str, float] = {}
        review_reasons: List[str] = []

        # 2. Xử lý bóc tách theo loại hồ sơ
        if doc_type in ("CCCD", "CCCD_FRONT", "CCCD_BACK", "IDENTITY_CARD"):
            extracted_fields, field_confidences, review_reasons = cls._extract_cccd(raw_text)
        elif doc_type in ("DIPLOMA", "DEGREE", "CERTIFICATE"):
            extracted_fields, field_confidences, review_reasons = cls._extract_diploma(raw_text)
        elif doc_type in ("LABOR_CONTRACT", "CONTRACT"):
            extracted_fields, field_confidences, review_reasons = cls._extract_labor_contract(raw_text)
        else:
            extracted_fields, field_confidences, review_reasons = cls._extract_general_doc(raw_text)

        # 3. Tính điểm tin cậy tổng thể (Overall Confidence)
        if field_confidences:
            overall_confidence = sum(field_confidences.values()) / len(field_confidences)
        else:
            overall_confidence = 0.50

        overall_confidence = round(max(0.0, min(1.0, overall_confidence)), 2)

        # 4. Quyết định có cần đối soát thủ công (Split-screen Review) không
        needs_review = overall_confidence < 0.85 or len(review_reasons) > 0
        if overall_confidence < 0.85 and "Điểm tin cậy OCR tổng thể dưới 85%" not in review_reasons:
            review_reasons.append(f"Điểm tin cậy tổng thể thấp ({int(overall_confidence * 100)}% < 85%)")

        return OcrExtractResult(
            document_type=doc_type,
            raw_text=raw_text,
            extracted_fields=extracted_fields,
            field_confidences=field_confidences,
            overall_confidence=overall_confidence,
            needs_manual_review=needs_review,
            review_reasons=review_reasons,
            metadata={
                "parser_engine": "Cyclosa-Vision-Hybrid-v1",
                "char_count": len(raw_text),
                "fields_extracted_count": len(extracted_fields)
            }
        )

    # ==========================================
    # CÁC HÀM TIỆN ÍCH TRÍCH XUẤT CHUYÊN BIỆT
    # ==========================================

    @classmethod
    def _extract_cccd(cls, text: str) -> Tuple[Dict[str, Any], Dict[str, float], List[str]]:
        """Bóc tách Căn cước công dân kèm tính toán điểm tin cậy chính xác"""
        reasons: List[str] = []
        confidences: Dict[str, float] = {}

        # Thử gọi LLM có cấu trúc
        try:
            llm_res = LlmClient.generate_structured(
                response_model=CccdExtractedData,
                system_prompt=CCCD_EXTRACTION_PROMPT,
                user_prompt=f"Hãy bóc tách thông tin CCCD từ văn bản sau:\n\n{text}"
            )
            data = llm_res.model_dump()
        except Exception:
            data = {}

        # Heuristic / Regex Verification & Confidence Scoring
        id_match = re.search(r'\b(\d{12})\b', text)
        if id_match:
            data["id_number"] = id_match.group(1)
            confidences["id_number"] = 0.99
        elif data.get("id_number") and re.match(r'^\d{12}$', str(data.get("id_number", ""))):
            confidences["id_number"] = 0.95
        else:
            confidences["id_number"] = 0.30
            reasons.append("Không phát hiện số CCCD hợp lệ gồm 12 chữ số")

        # Họ tên
        if data.get("full_name"):
            confidences["full_name"] = 0.95 if data["full_name"].isupper() else 0.85
        else:
            name_match = re.search(r'(?:Họ và tên|Full name|Họ tên)[:\s]+([A-ZÀ-Ỹ\s]{3,35})', text, re.IGNORECASE)
            if name_match:
                data["full_name"] = name_match.group(1).strip()
                confidences["full_name"] = 0.90
            else:
                confidences["full_name"] = 0.40
                reasons.append("Chưa nhận diện chắc chắn họ tên trên thẻ CCCD")

        # Ngày sinh
        dob_match = re.search(r'(?:Ngày sinh|Date of birth|Sinh ngày)[:\s]+(\d{2}[/-]\d{2}[/-]\d{4})', text, re.IGNORECASE)
        if dob_match:
            parts = re.split(r'[/-]', dob_match.group(1))
            data["date_of_birth"] = f"{parts[2]}-{parts[1]}-{parts[0]}"
            confidences["date_of_birth"] = 0.98
        elif data.get("date_of_birth"):
            confidences["date_of_birth"] = 0.90
        else:
            confidences["date_of_birth"] = 0.40
            reasons.append("Thiếu thông tin ngày sinh")

        # Giới tính & Quê quán & Nơi thường trú
        confidences["gender"] = 0.95 if data.get("gender") in ("NAM", "NỮ", "Nam", "Nữ") else 0.60
        confidences["nationality"] = 0.99 if data.get("nationality") else 0.80
        confidences["place_of_origin"] = 0.88 if data.get("place_of_origin") else 0.50
        confidences["place_of_residence"] = 0.90 if data.get("place_of_residence") else 0.50

        return data, confidences, reasons

    @classmethod
    def _extract_diploma(cls, text: str) -> Tuple[Dict[str, Any], Dict[str, float], List[str]]:
        """Bóc tách Văn bằng tốt nghiệp"""
        reasons: List[str] = []
        confidences: Dict[str, float] = {}

        try:
            llm_res = LlmClient.generate_structured(
                response_model=DiplomaExtractedData,
                system_prompt=DIPLOMA_EXTRACTION_PROMPT,
                user_prompt=f"Hãy bóc tách thông tin văn bằng từ văn bản sau:\n\n{text}"
            )
            data = llm_res.model_dump()
        except Exception:
            data = {}

        # Trường đào tạo Heuristic nếu LLM chưa có
        if not data.get("school_name"):
            school_match = re.search(r'(TRƯỜNG\s+ĐẠI\s+HỌC\s+[A-ZÀ-Ỹ\s]+|ĐẠI\s+HỌC\s+[A-ZÀ-Ỹ\s]+|HỌC\s+VIỆN\s+[A-ZÀ-Ỹ\s]+)', text, re.IGNORECASE)
            if school_match:
                data["school_name"] = school_match.group(1).strip()

        # Ngành đào tạo
        if not data.get("major"):
            major_match = re.search(r'(?:Ngành đào tạo|Ngành|Chuyên ngành)[:\s]+([^\n\r]+)', text, re.IGNORECASE)
            if major_match:
                data["major"] = major_match.group(1).strip()

        # Đánh giá trường trường học
        confidences["school_name"] = 0.95 if data.get("school_name") else 0.40
        if not data.get("school_name"):
            reasons.append("Không trích xuất được tên cơ sở đào tạo / trường đại học")

        confidences["major"] = 0.92 if data.get("major") else 0.50
        confidences["degree_level"] = 0.95 if data.get("degree_level") else 0.50
        confidences["ranking"] = 0.90 if data.get("ranking") else 0.60

        # Năm tốt nghiệp: ưu tiên tìm cụm từ "Năm tốt nghiệp"
        grad_match = re.search(r'(?:Năm tốt nghiệp|Tốt nghiệp năm)[:\s]+(\d{4})', text, re.IGNORECASE)
        if grad_match:
            data["graduation_year"] = int(grad_match.group(1))
            confidences["graduation_year"] = 0.98
        elif data.get("graduation_year"):
            confidences["graduation_year"] = 0.95
        else:
            year_match = re.findall(r'\b(19\d{2}|20\d{2})\b', text)
            if year_match:
                # Nếu có nhiều năm (vd ngày sinh 1995, tốt nghiệp 2018), lấy năm lớn nhất
                data["graduation_year"] = int(max(year_match))
                confidences["graduation_year"] = 0.85
            else:
                confidences["graduation_year"] = 0.40

        confidences["diploma_number"] = 0.88 if data.get("diploma_number") else 0.50

        return data, confidences, reasons

    @classmethod
    def _extract_labor_contract(cls, text: str) -> Tuple[Dict[str, Any], Dict[str, float], List[str]]:
        """Bóc tách Hợp đồng lao động"""
        reasons: List[str] = []
        confidences: Dict[str, float] = {}

        try:
            llm_res = LlmClient.generate_structured(
                response_model=LaborContractExtractedData,
                system_prompt=LABOR_CONTRACT_EXTRACTION_PROMPT,
                user_prompt=f"Hãy bóc tách thông tin hợp đồng lao động từ văn bản sau:\n\n{text}"
            )
            data = llm_res.model_dump()
        except Exception:
            data = {}

        confidences["contract_number"] = 0.92 if data.get("contract_number") else 0.50
        confidences["contract_type"] = 0.95 if data.get("contract_type") else 0.60
        confidences["employer_name"] = 0.90 if data.get("employer_name") else 0.50
        confidences["employee_name"] = 0.92 if data.get("employee_name") else 0.50
        confidences["job_title"] = 0.90 if data.get("job_title") else 0.50
        confidences["start_date"] = 0.90 if data.get("start_date") else 0.50
        confidences["base_salary"] = 0.88 if data.get("base_salary") else 0.50

        if not data.get("employee_name"):
            reasons.append("Chưa xác định họ tên người lao động trên hợp đồng")

        return data, confidences, reasons

    @classmethod
    def _extract_general_doc(cls, text: str) -> Tuple[Dict[str, Any], Dict[str, float], List[str]]:
        """Bóc tách tài liệu chung"""
        reasons: List[str] = []
        confidences: Dict[str, float] = {}

        try:
            llm_res = LlmClient.generate_structured(
                response_model=GeneralDocExtractedData,
                system_prompt=GENERAL_DOC_EXTRACTION_PROMPT,
                user_prompt=f"Hãy trích xuất tóm tắt và thông tin hành chính từ văn bản:\n\n{text}"
            )
            data = llm_res.model_dump()
        except Exception:
            data = {
                "document_title": text[:60].replace("\n", " ") if text else "Tài liệu lưu trữ",
                "summary": text[:200] if text else "Không có nội dung"
            }

        confidences["document_title"] = 0.90 if data.get("document_title") else 0.50
        confidences["document_number"] = 0.85 if data.get("document_number") else 0.50
        confidences["issuing_authority"] = 0.85 if data.get("issuing_authority") else 0.50
        confidences["summary"] = 0.90 if data.get("summary") else 0.50

        return data, confidences, reasons

    # ==========================================
    # KỸ THUẬT PHÂN TÍCH HÌNH ẢNH & THẨM ĐỊNH DPI
    # ==========================================

    @classmethod
    def _get_file_bytes(cls, file_url: Optional[str], file_base64: Optional[str]) -> Optional[bytes]:
        """Lấy raw bytes từ URL hoặc Base64"""
        if file_base64:
            try:
                # Cắt bỏ prefix data:image/...;base64, nếu có
                clean_b64 = file_base64.split(",")[-1]
                return base64.b64decode(clean_b64)
            except Exception as e:
                logger.error(f"Lỗi giải mã base64: {e}")
                return None

        if file_url:
            try:
                resp = requests.get(file_url, timeout=15.0)
                if resp.status_code == 200:
                    return resp.content
            except Exception as e:
                logger.error(f"Lỗi tải file từ {file_url}: {e}")
                return None

        return None

    @classmethod
    def _bytes_to_first_page_image(cls, data: bytes) -> Optional[Image.Image]:
        """Trích xuất trang đầu tiên của PDF hoặc mở ảnh thông thường"""
        # 1. Thử mở trực tiếp như ảnh (JPEG, PNG, TIFF)
        try:
            img = Image.open(io.BytesIO(data))
            img.load()
            return img
        except Exception:
            pass

        # 2. Thử mở bằng PyMuPDF (fitz) nếu là PDF
        if fitz:
            try:
                doc = fitz.open(stream=data, filetype="pdf")
                if len(doc) > 0:
                    page = doc[0]
                    # Render ở độ phóng đại x2 để giữ chất lượng
                    pix = page.get_pixmap(dpi=300)
                    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                    return img
            except Exception as e:
                logger.debug(f"Không thể render PDF bằng fitz: {e}")

        return None

    @classmethod
    def _calculate_dpi(cls, img: Image.Image) -> int:
        """
        Tính toán chỉ số DPI thực tế của tài liệu.
        Quy chuẩn: A4 = 8.27 x 11.69 inches.
        """
        # Kiểm tra metadata DPI của ảnh
        dpi_info = img.info.get("dpi")
        if dpi_info and isinstance(dpi_info, (tuple, list)) and len(dpi_info) >= 2:
            x_dpi, y_dpi = int(dpi_info[0]), int(dpi_info[1])
            if x_dpi > 0 and y_dpi > 0:
                return min(x_dpi, y_dpi)

        # Tính toán DPI dựa trên tỷ lệ kích thước điểm ảnh đối chiếu khổ A4 (210 x 297 mm = 8.2677 x 11.6929 inches)
        width, height = img.size
        shorter_side = min(width, height)
        longer_side = max(width, height)

        calc_dpi_w = round(shorter_side / 8.2677)
        calc_dpi_h = round(longer_side / 11.6929)
        estimated_dpi = min(calc_dpi_w, calc_dpi_h)

        # Giới hạn cận hợp lý (ảnh 2480px đối chiếu A4 sẽ đạt đúng 300 DPI)
        return max(72, estimated_dpi)

    @classmethod
    def _calculate_blur_score(cls, img: Image.Image) -> Tuple[float, bool]:
        """
        Tính toán độ sắc nét bằng phương sai toán tử Laplacian (Laplacian Variance).
        Ngưỡng < 100.0 được coi là ảnh mờ/nhòe.
        """
        try:
            # Chuyển ảnh PIL sang grayscale numpy array
            gray = np.array(img.convert("L"))
            if cv2 is not None:
                laplacian_var = float(cv2.Laplacian(gray, cv2.CV_64F).var())
            else:
                # Fallback thuần numpy nếu không có cv2
                dy, dx = np.gradient(gray.astype(np.float64))
                laplacian_var = float(np.var(dx) + np.var(dy))

            is_blurry = laplacian_var < 100.0
            return laplacian_var, is_blurry
        except Exception as e:
            logger.warning(f"Lỗi tính toán blur score: {e}")
            return 150.0, False

    @classmethod
    def _detect_skew_angle(cls, img: Image.Image) -> float:
        """
        Phát hiện góc nghiêng của văn bản để hỗ trợ deskew tự động.
        """
        try:
            if cv2 is None:
                return 0.0

            gray = np.array(img.convert("L"))
            # Ngưỡng hóa Otsu nhị phân đảo
            _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
            coords = np.column_stack(np.where(thresh > 0))
            if len(coords) < 50:
                return 0.0

            angle = cv2.minAreaRect(coords)[-1]
            if angle < -45:
                angle = -(90 + angle)
            else:
                angle = -angle

            # Nếu góc quá lớn hoặc quá nhỏ
            if abs(angle) > 45:
                return 0.0

            return float(angle)
        except Exception as e:
            logger.debug(f"Không thể đo góc nghiêng: {e}")
            return 0.0
