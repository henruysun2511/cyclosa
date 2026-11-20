from pydantic import BaseModel, Field, model_validator
from typing import List, Optional, Dict, Any
from app.common.schemas.response import ApiResponse


# --- 1. Schemas cho Bóc tách & Chấm điểm CV ---

class CandidateParsedProfile(BaseModel):
    full_name: Optional[str] = Field(None, description="Họ và tên ứng viên")
    email: Optional[str] = Field(None, description="Địa chỉ email")
    phone: Optional[str] = Field(None, description="Số điện thoại")
    date_of_birth: Optional[str] = Field(None, description="Ngày sinh")
    address: Optional[str] = Field(None, description="Địa chỉ cư trú")
    linkedin_url: Optional[str] = Field(None, description="Hồ sơ LinkedIn")
    portfolio_url: Optional[str] = Field(None, description="Hồ sơ Portfolio/GitHub")
    skills: List[str] = Field(default_factory=list, description="Danh sách kỹ năng chuyên môn trích xuất từ CV")
    years_of_experience: float = Field(default=0.0, description="Ước tính số năm kinh nghiệm làm việc")
    education: Optional[str] = Field(None, description="Trình độ học vấn / Trường đào tạo cao nhất")
    highlight_projects: List[str] = Field(default_factory=list, description="Các dự án nổi bật đã tham gia")
    work_experiences: List[Dict[str, Any]] = Field(default_factory=list, description="Chi tiết kinh nghiệm làm việc")
    educations: List[Dict[str, Any]] = Field(default_factory=list, description="Chi tiết quá trình đào tạo học vấn")


class CvScreenRequest(BaseModel):
    resume_url: Optional[str] = Field(None, description="Đường dẫn file CV trên Cloudinary/S3 (PDF, DOCX)")
    resume_text: Optional[str] = Field(None, description="Văn bản CV thô nếu đã trích xuất sẵn")
    candidate_name: Optional[str] = Field(None, description="Họ tên ứng viên (để hỗ trợ khử định danh PII)")
    job_title: str = Field(..., description="Chức danh vị trí tuyển dụng")
    job_requirements: Optional[str] = Field(None, description="Nội dung mô tả yêu cầu công việc (JD)")
    job_description: Optional[str] = Field(None, description="Mô tả công việc (alias)")
    requirements: Optional[str] = Field(None, description="Yêu cầu công việc (alias)")
    cv_text: Optional[str] = Field(None, description="Nội dung CV (alias)")
    cv_url: Optional[str] = Field(None, description="URL CV (alias)")
    ai_screening_consent: bool = Field(True, description="Xác nhận đồng thuận của ứng viên cho phép AI xử lý hồ sơ")

    @model_validator(mode="before")
    @classmethod
    def normalize_fields(cls, data: Any) -> Any:
        if isinstance(data, dict):
            # Đồng bộ URL/Text
            if not data.get("resume_text") and data.get("cv_text"):
                data["resume_text"] = data["cv_text"]
            if not data.get("resume_url") and data.get("cv_url"):
                data["resume_url"] = data["cv_url"]
            # Đồng bộ yêu cầu công việc
            if not data.get("job_requirements"):
                req = data.get("requirements") or data.get("job_description") or ""
                data["job_requirements"] = req
        return data


class CvScreenResult(BaseModel):
    parsed_profile: CandidateParsedProfile
    match_score: float = Field(..., ge=0.0, le=100.0, description="Điểm số phù hợp từ 0.00 đến 100.00")
    matching_score: Optional[float] = Field(None, description="Alias tương thích backend cho match_score")
    confidence_level: str = Field(..., description="Độ tin cậy của AI: HIGH, MEDIUM, LOW")
    strengths: List[str] = Field(default_factory=list, description="Các điểm mạnh phù hợp vượt trội với yêu cầu JD")
    missing_skills: List[str] = Field(default_factory=list, description="Các kỹ năng hoặc yêu cầu kinh nghiệm còn thiếu")
    weaknesses: List[str] = Field(default_factory=list, description="Các điểm yếu / thiếu sót (alias)")
    reasoning: str = Field(..., description="Bản giải trình đánh giá bằng ngôn ngữ tự nhiên tiếng Việt")
    summary: Optional[str] = Field(None, description="Tóm tắt đánh giá (alias)")
    recommendation: Optional[str] = Field(None, description="Đề xuất của AI")
    is_low_confidence: bool = Field(False, description="Cờ cảnh báo cần xem xét thủ công nếu hồ sơ quá ít dữ liệu")

    @model_validator(mode="before")
    @classmethod
    def set_aliases(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if "match_score" in data and "matching_score" not in data:
                data["matching_score"] = data["match_score"]
            if "reasoning" in data and "summary" not in data:
                data["summary"] = data["reasoning"]
            if "missing_skills" in data and not data.get("weaknesses"):
                data["weaknesses"] = data["missing_skills"]
            if "confidence_level" in data and not data.get("recommendation"):
                data["recommendation"] = "Đề xuất phỏng vấn" if data.get("match_score", 0) >= 70 else "Xem xét thêm"
        return data


class CvScreenResponse(ApiResponse[CvScreenResult]):
    pass


class CvParseRequest(BaseModel):
    resume_url: Optional[str] = Field(None, description="URL tệp CV cần bóc tách")
    resume_text: Optional[str] = Field(None, description="Nội dung CV thô")


class CvParseResponse(ApiResponse[CandidateParsedProfile]):
    pass


# --- 2. Schemas cho AI Sinh Bộ câu hỏi Phỏng vấn ---

class InterviewQuestionItem(BaseModel):
    category: str = Field(..., description="Phân loại câu hỏi: TECHNICAL, PROBLEM_SOLVING, CULTURE_FIT, BEHAVIORAL")
    question_text: str = Field(..., description="Nội dung câu hỏi phỏng vấn chi tiết")
    purpose: str = Field(..., description="Mục tiêu phỏng vấn và năng lực cần đánh giá")
    expected_answer_guideline: str = Field(..., description="Hướng dẫn gợi ý câu trả lời kỳ vọng đạt chuẩn cho giám khảo")
    sample_answer: Optional[str] = Field(None, description="Gợi ý câu trả lời mẫu (alias)")
    evaluation_criteria: Optional[str] = Field(None, description="Tiêu chí đánh giá (alias)")
    star_task: Optional[str] = Field(None, description="Nhiệm vụ hoặc thách thức tình huống (STAR model)")
    star_action: Optional[str] = Field(None, description="Hành động kỳ vọng ứng viên triển khai (STAR model)")

    @model_validator(mode="before")
    @classmethod
    def set_question_aliases(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if "expected_answer_guideline" in data and not data.get("sample_answer"):
                data["sample_answer"] = data["expected_answer_guideline"]
            if "purpose" in data and not data.get("evaluation_criteria"):
                data["evaluation_criteria"] = data["purpose"]
        return data


class InterviewQuestionGenRequest(BaseModel):
    job_title: str = Field(..., description="Chức danh vị trí phỏng vấn")
    job_requirements: Optional[str] = Field(None, description="Yêu cầu công việc (JD)")
    candidate_skills: List[str] = Field(default_factory=list, description="Kỹ năng ứng viên sở hữu")
    missing_skills: List[str] = Field(default_factory=list, description="Kỹ năng còn thiếu hoặc cần đào sâu kiểm tra")
    interview_round_type: str = Field("TECHNICAL", description="Loại vòng phỏng vấn: HR, TECHNICAL, CULTURE_FIT, EXECUTIVE")
    question_count: int = Field(5, ge=1, le=15, description="Số lượng câu hỏi mong muốn (1 - 15)")

    # Các trường tương thích từ cyclosa_be QuestionRequest
    seniority_level: Optional[str] = Field(None, description="Cấp bậc thâm niên")
    focus_areas: Optional[List[str]] = Field(None, description="Khu vực trọng tâm phỏng vấn")
    num_questions: Optional[int] = Field(None, description="Số lượng câu hỏi (alias)")

    @model_validator(mode="before")
    @classmethod
    def normalize_interview_request(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if not data.get("job_requirements"):
                focus = ", ".join(data.get("focus_areas", [])) if data.get("focus_areas") else ""
                level = data.get("seniority_level", "")
                data["job_requirements"] = f"Vị trí cấp bậc {level}. Trọng tâm đánh giá: {focus}" if (level or focus) else "Yêu cầu chuyên môn tiêu chuẩn."
            if data.get("num_questions"):
                data["question_count"] = data["num_questions"]
            if data.get("focus_areas") and not data.get("missing_skills"):
                data["missing_skills"] = data["focus_areas"]
        return data


class InterviewQuestionGenResult(BaseModel):
    questions: List[InterviewQuestionItem] = Field(default_factory=list)


class InterviewQuestionGenResponse(ApiResponse[InterviewQuestionGenResult]):
    pass


# --- 3. Schemas cho AI Quét Cảnh báo Nội dung Phỏng vấn (Compliance Scanner) ---

class ContentScanRequest(BaseModel):
    content_text: Optional[str] = Field(None, description="Nội dung câu hỏi phỏng vấn hoặc nhận xét scorecard của giám khảo")
    comments: Optional[str] = Field(None, description="Nội dung nhận xét (alias từ backend)")
    context: str = Field("INTERVIEW_SCORECARD", description="Ngữ cảnh: INTERVIEW_QUESTION, INTERVIEW_SCORECARD, CANDIDATE_NOTE")

    @model_validator(mode="before")
    @classmethod
    def normalize_content_scan(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if not data.get("content_text") and data.get("comments"):
                data["content_text"] = data["comments"]
        return data


class ContentScanResult(BaseModel):
    has_violation: bool = Field(False, description="Có phát hiện vi phạm luật lao động hoặc phân biệt đối xử không")
    is_clean: bool = Field(True, description="Nội dung trong sạch, không có vi phạm (alias)")
    violation_category: Optional[str] = Field(None, description="GENDER_BIAS, MARITAL_STATUS, RELIGION, AGE_DISCRIMINATION, REGIONAL_BIAS, NONE")
    reason: str = Field(..., description="Lý do phân tích chi tiết của AI")
    suggested_correction: Optional[str] = Field(None, description="Gợi ý sửa đổi câu chữ cho chuẩn mực chuyên nghiệp")
    flagged_items: List[Dict[str, Any]] = Field(default_factory=list, description="Danh sách các mục bị gắn cờ vi phạm")

    @model_validator(mode="before")
    @classmethod
    def set_scan_aliases(cls, data: Any) -> Any:
        if isinstance(data, dict):
            has_viol = data.get("has_violation", False)
            data["is_clean"] = not has_viol
            if has_viol and not data.get("flagged_items"):
                data["flagged_items"] = [{
                    "forbidden_phrase": data.get("violation_category", "Nội dung vi phạm"),
                    "category": data.get("violation_category", "POLICY_VIOLATION"),
                    "suggestion": data.get("suggested_correction", ""),
                    "severity": "HIGH"
                }]
        return data


class ContentScanResponse(ApiResponse[ContentScanResult]):
    pass
