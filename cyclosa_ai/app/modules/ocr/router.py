from fastapi import APIRouter, Depends
from app.core.security import verify_internal_api_key
from app.modules.ocr.schemas import (
    DocumentQualityCheckRequest, DocumentQualityCheckResponse,
    OcrExtractRequest, OcrExtractResponse
)
from app.modules.ocr.service import OcrAiService

router = APIRouter(
    prefix="/ocr",
    tags=["OCR & Document Digitization (TT 05/2025/TT-BNV)"],
    dependencies=[Depends(verify_internal_api_key)]
)


@router.post(
    "/quality-check",
    response_model=DocumentQualityCheckResponse,
    summary="Thẩm định kỹ thuật tệp số hóa theo Thông tư 05/2025/TT-BNV",
    description="Kiểm tra độ phân giải DPI (ngưỡng >= 300 DPI), độ mờ (Laplacian variance) và góc nghiêng của hồ sơ tài liệu."
)
def check_document_quality(request: DocumentQualityCheckRequest):
    result = OcrAiService.check_quality(request)
    return DocumentQualityCheckResponse.ok(
        data=result,
        message="Thẩm định chất lượng tệp số hóa hoàn tất"
    )


@router.post(
    "/extract",
    response_model=OcrExtractResponse,
    summary="OCR Bóc tách dữ liệu có cấu trúc từ hồ sơ nhân sự",
    description="Tự động nhận diện và bóc tách CCCD, Bằng cấp, Hợp đồng lao động kèm điểm tin cậy từng trường (Field Confidence) và đánh dấu đối soát thủ công."
)
def extract_document_data(request: OcrExtractRequest):
    result = OcrAiService.extract_document(request)
    return OcrExtractResponse.ok(
        data=result,
        message="Bóc tách thông tin tài liệu OCR thành công"
    )
