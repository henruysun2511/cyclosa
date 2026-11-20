import pytest
from fastapi import HTTPException
from app.api.v1.health import health_check
from app.core.security import verify_internal_api_key
from app.common.pii.redactor import PiiRedactor
from app.modules.recruitment.service import RecruitmentAiService
from app.modules.recruitment.router import (
    screen_candidate_cv,
    parse_candidate_cv,
    generate_interview_questions,
    scan_content_compliance
)
from app.modules.recruitment.schemas import (
    CvScreenRequest, CvParseRequest,
    InterviewQuestionGenRequest, ContentScanRequest
)
from app.core.exceptions import ConsentRequiredError

VALID_API_KEY = "cyclosa-internal-ai-secret-key-2026"


# --- 1. Test Health Check & Security ---

def test_health_check_endpoint():
    res = health_check()
    assert res.success is True
    assert res.data["status"] == "UP"


def test_security_verify_api_key():
    # Valid key
    verified = verify_internal_api_key(VALID_API_KEY)
    assert verified == VALID_API_KEY

    # Missing key
    with pytest.raises(HTTPException) as exc_info_401:
        verify_internal_api_key(None)
    assert exc_info_401.value.status_code == 401

    # Invalid key
    with pytest.raises(HTTPException) as exc_info_403:
        verify_internal_api_key("invalid-secret-key")
    assert exc_info_403.value.status_code == 403


# --- 2. Test PII Redactor Unit Logic ---

def test_pii_redactor_masks_sensitive_info():
    raw_cv = """
    Họ tên: Nguyễn Văn An
    Email: nguyen.van.an@gmail.com
    Số điện thoại: 0912345678
    Ngày sinh: 15/08/1995
    Giới tính: Nam
    Tình trạng hôn nhân: Đã kết hôn
    Số CMND: 001095012345
    Kỹ năng: Thành thạo Java, Spring Boot, PostgreSQL, Docker.
    """
    redacted, stats = PiiRedactor.redact(raw_cv, candidate_name="Nguyễn Văn An")

    assert "[ỨNG_VIÊN_NAME_REDACTED]" in redacted
    assert "[EMAIL_REDACTED]" in redacted
    assert "[PHONE_REDACTED]" in redacted
    assert "[NGÀY_SINH_REDACTED]" in redacted
    assert "[GIỚI_TÍNH_REDACTED]" in redacted
    assert "[HÔN_NHÂN_REDACTED]" in redacted
    assert "[ID_NUMBER_REDACTED]" in redacted
    assert "nguyen.van.an@gmail.com" not in redacted
    assert "0912345678" not in redacted

    assert stats["name_redacted"] is True
    assert stats["email_count"] >= 1
    assert stats["phone_count"] >= 1


# --- 3. Test Recruitment Service Unit Logic ---

def test_screen_cv_without_consent_raises():
    req = CvScreenRequest(
        job_title="Senior Java Developer",
        job_requirements="Spring Boot",
        resume_text="Java text",
        ai_screening_consent=False
    )
    with pytest.raises(ConsentRequiredError):
        RecruitmentAiService.screen_cv(req)


def test_screen_cv_service_success():
    req = CvScreenRequest(
        candidate_name="Nguyễn Văn An",
        job_title="Senior Java Developer",
        job_requirements="5 năm kinh nghiệm Java, Spring Boot, PostgreSQL, Docker, Redis",
        resume_text="Tôi có 5 năm làm backend Developer với Java, Spring Boot, PostgreSQL, Docker và Redis cache.",
        ai_screening_consent=True
    )
    res = RecruitmentAiService.screen_cv(req)
    assert res.match_score >= 50.0
    assert res.confidence_level in ["HIGH", "MEDIUM", "LOW"]
    assert len(res.strengths) >= 1
    assert "Java" in res.parsed_profile.skills


def test_generate_interview_questions():
    req = InterviewQuestionGenRequest(
        job_title="Senior Java Developer",
        job_requirements="Kiến trúc Microservices, Transaction isolation",
        candidate_skills=["Java", "Spring Boot"],
        missing_skills=["Microservices architecture", "Kubernetes"],
        interview_round_type="TECHNICAL",
        question_count=3
    )
    res = RecruitmentAiService.generate_interview_questions(req)
    assert len(res.questions) >= 1
    assert res.questions[0].question_text is not None
    assert res.questions[0].expected_answer_guideline is not None


def test_content_scan_compliance():
    req = ContentScanRequest(
        content_text="Ứng viên có dự định lập gia đình hoặc sinh con trong 2 năm tới không?",
        context="INTERVIEW_QUESTION"
    )
    res = RecruitmentAiService.scan_content_compliance(req)
    assert res.has_violation is True
    assert res.violation_category == "MARITAL_STATUS"


# --- 4. Test Recruitment Router Handlers ---

def test_screen_cv_router_handler_success():
    req = CvScreenRequest(
        candidate_name="Trần Thị B",
        job_title="Senior Java Developer",
        job_requirements="Yêu cầu 4+ năm kinh nghiệm Java, Spring Boot, PostgreSQL",
        resume_text="5 năm backend Java, Spring Boot, PostgreSQL",
        ai_screening_consent=True
    )
    res = screen_candidate_cv(req)
    assert res.success is True
    assert res.data.match_score > 0
    assert res.data.confidence_level in ["HIGH", "MEDIUM", "LOW"]


def test_parse_cv_router_handler_success():
    req = CvParseRequest(
        resume_text="Kỹ năng chính: Java, Spring Boot, PostgreSQL, Docker, Redis. 4 năm kinh nghiệm."
    )
    res = parse_candidate_cv(req)
    assert res.success is True
    assert len(res.data.skills) >= 1


def test_generate_questions_router_handler():
    req = InterviewQuestionGenRequest(
        job_title="Backend Developer",
        job_requirements="PostgreSQL optimization",
        candidate_skills=["Java"],
        missing_skills=["PostgreSQL indexing"],
        interview_round_type="TECHNICAL",
        question_count=3
    )
    res = generate_interview_questions(req)
    assert res.success is True
    assert len(res.data.questions) >= 1


def test_content_scan_router_handler():
    req = ContentScanRequest(
        content_text="Ứng viên đã kết hôn chưa và có kế hoạch sinh con không?",
        context="INTERVIEW_SCORECARD"
    )
    res = scan_content_compliance(req)
    assert res.success is True
    assert res.data.has_violation is True
