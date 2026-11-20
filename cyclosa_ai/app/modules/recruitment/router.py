from fastapi import APIRouter, Depends, UploadFile, File
from typing import Optional
from app.core.security import verify_internal_api_key
from app.common.parser.doc_extractor import DocumentExtractor
from app.modules.recruitment.schemas import (
    CvScreenRequest, CvScreenResponse,
    CvParseRequest, CvParseResponse,
    InterviewQuestionGenRequest, InterviewQuestionGenResponse,
    ContentScanRequest, ContentScanResponse
)
from app.modules.recruitment.service import RecruitmentAiService

router = APIRouter(
    prefix="/recruitment",
    tags=["Recruitment AI"],
    dependencies=[Depends(verify_internal_api_key)]
)


@router.post(
    "/cv/screen",
    response_model=CvScreenResponse,
    summary="Chấm điểm mức độ phù hợp CV & JD (AI Match Score)",
    description="Thực hiện PII Redaction và chấm điểm 0-100 kèm bản giải trình điểm mạnh/thiếu sót."
)
def screen_candidate_cv(request: CvScreenRequest):
    result = RecruitmentAiService.screen_cv(request)
    return CvScreenResponse.ok(data=result, message="Chấm điểm hồ sơ CV thành công")


@router.post(
    "/cv/parse",
    response_model=CvParseResponse,
    summary="Bóc tách thông tin CV (AI CV Parsing)",
    description="Trích xuất danh sách kỹ năng, số năm kinh nghiệm, học vấn và dự án nổi bật từ JSON payload."
)
def parse_candidate_cv(request: CvParseRequest):
    result = RecruitmentAiService.parse_cv(request)
    return CvParseResponse.ok(data=result, message="Bóc tách thông tin CV thành công")


@router.post(
    "/cv/parse-file",
    response_model=CvParseResponse,
    summary="Bóc tách thông tin từ tệp CV tải lên trực tiếp (Multipart Form Data)"
)
def parse_candidate_cv_file(file: UploadFile = File(...)):
    file_bytes = file.file.read()
    filename = (file.filename or "cv.pdf").lower()
    if filename.endswith(".docx") or filename.endswith(".doc"):
        raw_text = DocumentExtractor.extract_from_docx_bytes(file_bytes)
    else:
        raw_text = DocumentExtractor.extract_from_pdf_bytes(file_bytes)
    result = RecruitmentAiService.parse_cv(CvParseRequest(resume_text=raw_text))
    return CvParseResponse.ok(data=result, message="Bóc tách thông tin CV từ tệp thành công")


@router.post(
    "/interviews/generate-questions",
    response_model=InterviewQuestionGenResponse,
    summary="AI Sinh Bộ câu hỏi Phỏng vấn STAR thông minh",
    description="Tự động sinh bộ câu hỏi phỏng vấn đào sâu vào kỹ năng còn thiếu của ứng viên."
)
@router.post(
    "/interview/questions",
    response_model=InterviewQuestionGenResponse,
    include_in_schema=False
)
def generate_interview_questions(request: InterviewQuestionGenRequest):
    result = RecruitmentAiService.generate_interview_questions(request)
    return InterviewQuestionGenResponse.ok(data=result, message="Khởi tạo bộ câu hỏi phỏng vấn thành công")


@router.post(
    "/compliance/scan-content",
    response_model=ContentScanResponse,
    summary="AI Quét Cảnh báo Vi phạm Nội dung & Thiên vị",
    description="Kiểm tra câu hỏi phỏng vấn hoặc nhận xét scorecard để phòng ngừa vi phạm luật lao động."
)
@router.post(
    "/scorecard/scan",
    response_model=ContentScanResponse,
    include_in_schema=False
)
def scan_content_compliance(request: ContentScanRequest):
    result = RecruitmentAiService.scan_content_compliance(request)
    return ContentScanResponse.ok(data=result, message="Rà soát nội dung tuân thủ hoàn tất")
