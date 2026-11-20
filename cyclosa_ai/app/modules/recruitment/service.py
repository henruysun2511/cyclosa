import logging
from app.modules.recruitment.schemas import (
    CvScreenRequest, CvScreenResult,
    CvParseRequest, CandidateParsedProfile,
    InterviewQuestionGenRequest, InterviewQuestionGenResult,
    ContentScanRequest, ContentScanResult
)
from app.modules.recruitment.prompts import (
    CV_SCREENING_SYSTEM_PROMPT,
    INTERVIEW_QUESTION_SYSTEM_PROMPT,
    CONTENT_SCAN_SYSTEM_PROMPT
)
from app.common.parser.doc_extractor import DocumentExtractor
from app.common.pii.redactor import PiiRedactor
from app.common.llm.client import LlmClient
from app.core.exceptions import (
    ConsentRequiredError,
    JobRequirementsNotDefinedError,
    InvalidFileForAiError
)

logger = logging.getLogger("cyclosa_ai.recruitment")


class RecruitmentAiService:
    """
    Dịch vụ AI Xử lý Phân hệ Tuyển dụng & Thu hút nhân tài (Module 04)
    Áp dụng mô hình thực thi đồng bộ an toàn (FastAPI tự động điều phối qua Threadpool)
    """

    @classmethod
    def screen_cv(cls, request: CvScreenRequest) -> CvScreenResult:
        """
        Quy trình Sàng lọc CV và Tính điểm Phù hợp (Match Score):
        1. Kiểm tra sự đồng thuận (Consent) - BẮT BUỘC.
        2. Kiểm tra yêu cầu JD.
        3. Trích xuất text từ tệp CV (PDF/Word qua Cloudinary URL).
        4. Khử định danh dữ liệu cá nhân nhạy cảm (PII Redaction).
        5. Gọi mô hình LLM với cấu trúc Pydantic nghiêm ngặt.
        """
        # 1. Ràng buộc đồng thuận AI
        if not request.ai_screening_consent:
            raise ConsentRequiredError("Ứng viên chưa cung cấp xác nhận đồng thuận (ai_screening_consent = false).")

        # 2. Ràng buộc mô tả công việc (JD)
        if not request.job_requirements or not request.job_requirements.strip():
            raise JobRequirementsNotDefinedError("Vị trí tuyển dụng chưa có nội dung yêu cầu công việc (JD).")

        # 3. Trích xuất text từ CV
        raw_cv_text = request.resume_text
        if not raw_cv_text and request.resume_url:
            raw_cv_text = DocumentExtractor.extract_from_url(request.resume_url)

        if not raw_cv_text or not raw_cv_text.strip():
            raise InvalidFileForAiError("Không có nội dung văn bản CV để xử lý.")

        # 4. Khử định danh PII (Anti-Bias & Privacy Protection)
        redacted_cv_text, redaction_stats = PiiRedactor.redact(
            text=raw_cv_text,
            candidate_name=request.candidate_name
        )

        # 5. Soạn user prompt và gọi LLM
        user_prompt = f"""
VỊ TRÍ ỨNG TUYỂN: {request.job_title}

YÊU CẦU CÔNG VIỆC (JD):
{request.job_requirements}

HỒ SƠ ỨNG VIÊN (ĐÃ KHỬ PII):
{redacted_cv_text}
"""
        logger.info(f"Đang thực hiện AI screening cho vị trí '{request.job_title}'...")
        result: CvScreenResult = LlmClient.generate_structured(
            response_model=CvScreenResult,
            system_prompt=CV_SCREENING_SYSTEM_PROMPT,
            user_prompt=user_prompt,
            temperature=0.2
        )

        # Gắn cờ cảnh báo nếu độ tin cậy thấp
        result.is_low_confidence = (result.confidence_level == "LOW")
        return result

    @classmethod
    def parse_cv(cls, request: CvParseRequest) -> CandidateParsedProfile:
        """
        Bóc tách thông tin CV thành dữ liệu JSON có cấu trúc
        """
        raw_cv_text = request.resume_text
        if not raw_cv_text and request.resume_url:
            raw_cv_text = DocumentExtractor.extract_from_url(request.resume_url)

        if not raw_cv_text or not raw_cv_text.strip():
            raise InvalidFileForAiError("Không có nội dung văn bản CV để bóc tách.")

        # Khử định danh trước khi gửi cho LLM
        redacted_text, _ = PiiRedactor.redact(raw_cv_text)

        system_prompt = "Bạn là Chuyên gia bóc tách CV. Hãy phân tích nội dung hồ sơ và trích xuất danh sách kỹ năng, số năm kinh nghiệm, học vấn và các dự án nổi bật."
        user_prompt = f"Nội dung CV:\n{redacted_text}"

        parsed_profile: CandidateParsedProfile = LlmClient.generate_structured(
            response_model=CandidateParsedProfile,
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            temperature=0.1
        )
        return parsed_profile

    @classmethod
    def generate_interview_questions(cls, request: InterviewQuestionGenRequest) -> InterviewQuestionGenResult:
        """
        Tự động tạo bộ câu hỏi phỏng vấn cá nhân hóa theo mô hình STAR
        """
        user_prompt = f"""
VỊ TRÍ TUYỂN DỤNG: {request.job_title}
LOẠI VÒNG PHỎNG VẤN: {request.interview_round_type}
SỐ LƯỢNG CÂU HỎI CẦN TẠO: {request.question_count}

YÊU CẦU CÔNG VIỆC (JD):
{request.job_requirements}

KỸ NĂNG ỨNG VIÊN SỞ HỮU:
{', '.join(request.candidate_skills) if request.candidate_skills else 'Chưa có thông tin chi tiết'}

CÁC KỸ NĂNG CÒN THIẾU / CẦN ĐÀO SÂU KIỂM TRA (MISSING SKILLS):
{', '.join(request.missing_skills) if request.missing_skills else 'Không có khoảng trống nổi bật'}
"""
        result: InterviewQuestionGenResult = LlmClient.generate_structured(
            response_model=InterviewQuestionGenResult,
            system_prompt=INTERVIEW_QUESTION_SYSTEM_PROMPT,
            user_prompt=user_prompt,
            temperature=0.3
        )
        return result

    @classmethod
    def scan_content_compliance(cls, request: ContentScanRequest) -> ContentScanResult:
        """
        Rà soát nội dung câu hỏi hoặc nhận xét đánh giá để phòng ngừa vi phạm pháp luật / thiên vị
        """
        user_prompt = f"""
NGỮ CẢNH ĐÁNH GIÁ: {request.context}

NỘI DUNG VĂN BẢN CẦN QUÉT:
\"{request.content_text}\"
"""
        result: ContentScanResult = LlmClient.generate_structured(
            response_model=ContentScanResult,
            system_prompt=CONTENT_SCAN_SYSTEM_PROMPT,
            user_prompt=user_prompt,
            temperature=0.0
        )
        return result
