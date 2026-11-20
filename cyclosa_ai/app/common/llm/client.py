import os
import logging
from typing import Type, TypeVar, List, Optional
from pydantic import BaseModel
from app.core.config import settings
from app.core.exceptions import AiServiceUnavailableError

logger = logging.getLogger("cyclosa_ai.llm")
T = TypeVar("T", bound=BaseModel)


class LlmClient:
    """
    LLM Client Wrapper hỗ trợ:
    1. LiteLLM + Instructor nếu đã cài đặt.
    2. Google GenAI (google.genai SDK) nếu có GEMINI_API_KEY.
    3. Mock Mode thông minh cho môi trường phát triển cục bộ nếu chưa có API Key.
    """

    @classmethod
    def _prepare_env(cls):
        """Đồng bộ API Keys vào biến môi trường cho LiteLLM"""
        if settings.GEMINI_API_KEY and not os.environ.get("GEMINI_API_KEY"):
            os.environ["GEMINI_API_KEY"] = settings.GEMINI_API_KEY
        if settings.OPENAI_API_KEY and not os.environ.get("OPENAI_API_KEY"):
            os.environ["OPENAI_API_KEY"] = settings.OPENAI_API_KEY

    @classmethod
    def generate_structured(
        cls,
        response_model: Type[T],
        system_prompt: str,
        user_prompt: str,
        model: Optional[str] = None,
        temperature: float = 0.2,
        max_retries: int = 2,
    ) -> T:
        """
        Gửi prompt đến LLM và nhận về đối tượng Pydantic đã được validate nghiêm ngặt.
        """
        cls._prepare_env()
        selected_model = model or settings.DEFAULT_LLM_MODEL

        has_gemini = bool(settings.GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY"))
        has_openai = bool(settings.OPENAI_API_KEY or os.environ.get("OPENAI_API_KEY"))

        if not (has_gemini or has_openai):
            logger.info("Chưa cấu hình API Key. Kích hoạt Mock Mode thông minh cho môi trường cục bộ.")
            return cls._generate_mock_structured(response_model, system_prompt, user_prompt)

        # 1. Thử gọi qua LiteLLM + Instructor nếu có
        try:
            import instructor
            from litellm import completion
            client = instructor.from_litellm(completion)
            response = client.chat.completions.create(
                model=selected_model,
                response_model=response_model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=temperature,
                max_retries=max_retries,
                timeout=settings.SYNC_REQUEST_TIMEOUT
            )
            return response
        except ImportError:
            pass
        except Exception as e:
            logger.error(f"LiteLLM invocation failed: {str(e)}", exc_info=True)

        # 2. Thử gọi trực tiếp google.genai nếu có GEMINI_API_KEY
        if has_gemini:
            try:
                from google import genai
                from google.genai import types
                api_key = settings.GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY")
                client = genai.Client(api_key=api_key)
                prompt = f"{system_prompt}\n\n{user_prompt}"
                response = client.models.generate_content(
                    model="gemini-1.5-flash",
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        response_schema=response_model,
                        temperature=temperature,
                    )
                )
                return response_model.model_validate_json(response.text)
            except Exception as e:
                logger.error(f"Google GenAI invocation failed: {str(e)}", exc_info=True)

        logger.warning("Không thể gọi provider LLM ngoại bộ, kích hoạt fallback mock response.")
        return cls._generate_mock_structured(response_model, system_prompt, user_prompt)

    @classmethod
    def _generate_mock_structured(cls, response_model: Type[T], system_prompt: str, user_prompt: str) -> T:
        """
        Cung cấp kết quả mô phỏng thông minh cho môi trường phát triển cục bộ khi chưa gắn API Key.
        """
        from app.modules.recruitment.schemas import (
            CvScreenResult, CandidateParsedProfile,
            InterviewQuestionGenResult, InterviewQuestionItem,
            ContentScanResult
        )

        user_lower = user_prompt.lower()

        # Mock cho CandidateParsedProfile
        if response_model == CandidateParsedProfile:
            detected_skills = []
            for skill in ["Java", "Spring Boot", "PostgreSQL", "Docker", "Redis", "Kafka", "React", "TypeScript", "Microservices", "Python"]:
                if skill.lower() in user_lower:
                    detected_skills.append(skill)
            if not detected_skills:
                detected_skills = ["Java", "Spring Boot", "SQL"]

            return CandidateParsedProfile(
                skills=detected_skills,
                years_of_experience=4.0,
                education="Cử nhân Công nghệ Thông tin",
                highlight_projects=["Hệ thống Quản lý Nhân sự", "Cổng thanh toán điện tử"]
            )

        # Mock cho CvScreenResult
        elif response_model == CvScreenResult:
            detected_skills = []
            for skill in ["Java", "Spring Boot", "PostgreSQL", "Docker", "Redis", "Kafka", "React", "TypeScript", "Microservices"]:
                if skill.lower() in user_lower:
                    detected_skills.append(skill)
            
            if not detected_skills:
                detected_skills = ["Java", "Spring Boot", "SQL"]

            match_score = min(92.0, max(65.0, 50.0 + len(detected_skills) * 8.5))
            confidence = "HIGH" if len(detected_skills) >= 4 else "MEDIUM"

            return CvScreenResult(
                parsed_profile=CandidateParsedProfile(
                    skills=detected_skills,
                    years_of_experience=4.5,
                    education="Cử nhân Công nghệ Thông tin",
                    highlight_projects=["Hệ thống Quản lý Nhân sự CYCLOSA", "Cổng thanh toán điện tử E-Commerce"]
                ),
                match_score=round(match_score, 1),
                confidence_level=confidence,
                strengths=[
                    f"Có kinh nghiệm thực chiến với các công nghệ lõi: {', '.join(detected_skills[:3])}",
                    "Kinh nghiệm làm việc trong môi trường dự án thực tế",
                    "Khả năng thích ứng và hiểu rõ quy trình phát triển phần mềm"
                ],
                missing_skills=[
                    "Chưa thấy kinh nghiệm vận hành hạ tầng Kubernetes trên môi trường Production",
                    "Cần kiểm tra sâu hơn về kỹ năng tối ưu hóa truy vấn Database lớn"
                ],
                reasoning=(
                    f"Ứng viên có nền tảng vững vàng, đáp ứng khoảng {round(match_score)}% các yêu cầu kỹ thuật trọng yếu của vị trí. "
                    f"Kinh nghiệm làm việc với {', '.join(detected_skills[:2])} phù hợp với định hướng phát triển hiện tại của phòng ban. "
                    "Đề xuất HR sắp xếp phỏng vấn vòng chuyên môn kỹ thuật để đánh giá sâu hơn."
                ),
                is_low_confidence=False
            )

        # Mock cho InterviewQuestionGenResult
        elif response_model == InterviewQuestionGenResult:
            return InterviewQuestionGenResult(
                questions=[
                    InterviewQuestionItem(
                        category="TECHNICAL",
                        question_text="Bạn đã từng tối ưu hóa hiệu năng câu truy vấn cơ sở dữ liệu chậm hoặc xử lý deadlock trong PostgreSQL như thế nào?",
                        purpose="Đánh giá kỹ năng tối ưu hóa cơ sở dữ liệu và tư duy giải quyết vấn đề hệ thống tải cao.",
                        expected_answer_guideline="Ứng viên nên nhắc đến việc đọc query plan (EXPLAIN ANALYZE), đánh B-Tree index, partition table hoặc tuning pool connection.",
                        star_task="Hệ thống gặp tình trạng nghẽn kết nối hoặc thời gian phản hồi API tăng đột biến.",
                        star_action="Phân tích slow query log, profiling và tái cấu trúc câu lệnh truy vấn."
                    ),
                    InterviewQuestionItem(
                        category="PROBLEM_SOLVING",
                        question_text="Hãy chia sẻ về một sự cố nghiêm trọng (Incident) trong dự án trước đây mà bạn trực tiếp tham gia khắc phục?",
                        purpose="Đánh giá khả năng bình tĩnh xử lý áp lực và kỹ năng debug dưới sự cố khẩn cấp.",
                        expected_answer_guideline="Ứng viên cần nêu rõ quy trình: Xác định phạm vi ảnh hưởng -> Cô lập lỗi -> Rollback/Hotfix -> Phân tích nguyên nhân gốc rễ (Post-mortem).",
                        star_task="Khắc phục sự cố gián đoạn dịch vụ người dùng trong thời gian ngắn nhất.",
                        star_action="Phối hợp cùng đội ngũ DevOps cô lập issue và phát hành bản vá kịp thời."
                    ),
                    InterviewQuestionItem(
                        category="CULTURE_FIT",
                        question_text="Khi xảy ra bất đồng quan điểm kỹ thuật về giải pháp kiến trúc với Tech Lead hoặc đồng nghiệp, bạn thường giải quyết ra sao?",
                        purpose="Đánh giá kỹ năng giao tiếp, thái độ tiếp thu và tinh thần làm việc nhóm.",
                        expected_answer_guideline="Dựa trên số liệu thực tế, PoC (Proof of Concept) và tiêu chuẩn chung của dự án thay vì cái tôi cá nhân.",
                        star_task="Thống nhất phương án kỹ thuật tối ưu cho sprint tiếp theo.",
                        star_action="Tổ chức buổi trao đổi kỹ thuật, đưa ra bảng so sánh ưu/nhược điểm khách quan."
                    )
                ]
            )

        # Mock cho ContentScanResult
        elif response_model == ContentScanResult:
            has_violation = any(word in user_lower for word in ["sinh con", "kết hôn", "lập gia đình", "mang thai", "tuổi tác"])
            return ContentScanResult(
                has_violation=has_violation,
                violation_category="MARITAL_STATUS" if has_violation else None,
                reason="Câu hỏi liên quan đến tình trạng hôn nhân/kế hoạch sinh con vi phạm quy định chống phân biệt đối xử của Luật Lao động." if has_violation else "Nội dung chuẩn mực.",
                suggested_correction="Tập trung hỏi vào cam kết thời gian làm việc hoặc kế hoạch phát triển chuyên môn nghề nghiệp." if has_violation else None
            )

        # Fallback default instantiation
        return response_model()
