from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
import logging

logger = logging.getLogger("cyclosa_ai.exceptions")


class CyclosaAiException(Exception):
    def __init__(self, message: str, status_code: int = 400, error_code: str = "AI_PROCESSING_ERROR"):
        self.message = message
        self.status_code = status_code
        self.error_code = error_code
        super().__init__(self.message)


class ConsentRequiredError(CyclosaAiException):
    def __init__(self, message: str = "Ứng viên chưa cung cấp văn bản/xác nhận đồng thuận cho phép AI xử lý hồ sơ."):
        super().__init__(message=message, status_code=422, error_code="CONSENT_REQUIRED")


class JobRequirementsNotDefinedError(CyclosaAiException):
    def __init__(self, message: str = "Vị trí tuyển dụng chưa có mô tả yêu cầu công việc (JD), AI không đủ dữ liệu để chấm điểm."):
        super().__init__(message=message, status_code=422, error_code="JOB_REQUIREMENTS_NOT_DEFINED")


class PiiRedactionError(CyclosaAiException):
    def __init__(self, message: str = "Khử định danh thông tin cá nhân (PII Redaction) thất bại, dừng chấm điểm để bảo vệ quyền riêng tư."):
        super().__init__(message=message, status_code=500, error_code="PII_REDACTION_FAILED")


class InvalidFileForAiError(CyclosaAiException):
    def __init__(self, message: str = "Tệp hồ sơ CV không tồn tại, rỗng hoặc định dạng không được hỗ trợ."):
        super().__init__(message=message, status_code=400, error_code="INVALID_FILE_FOR_AI")


class AiServiceUnavailableError(CyclosaAiException):
    def __init__(self, message: str = "Dịch vụ AI nhà cung cấp (LLM Provider) tạm thời không phản hồi hoặc quá hạn thời gian xử lý."):
        super().__init__(message=message, status_code=503, error_code="AI_SERVICE_UNAVAILABLE")


async def cyclosa_exception_handler(request: Request, exc: CyclosaAiException):
    logger.error(f"CyclosaAiException on {request.url.path}: {exc.message} ({exc.error_code})")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "code": exc.status_code,
            "message": exc.message,
            "errorCode": exc.error_code,
            "data": None
        }
    )


async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "code": exc.status_code,
            "message": exc.detail,
            "errorCode": "HTTP_ERROR",
            "data": None
        }
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError):
    error_details = exc.errors()
    msg = error_details[0]["msg"] if error_details else "Dữ liệu yêu cầu không hợp lệ"
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "code": 422,
            "message": f"Dữ liệu không hợp lệ: {msg}",
            "errorCode": "VALIDATION_ERROR",
            "data": error_details
        }
    )

