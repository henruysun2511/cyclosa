from fastapi import APIRouter
from app.common.schemas.response import ApiResponse

router = APIRouter(tags=["Health"])


@router.get("/healthz", response_model=ApiResponse[dict], summary="Health Check")
def health_check():
    return ApiResponse.ok(
        data={"status": "UP", "service": "cyclosa_ai"},
        message="Dịch vụ CYCLOSA AI đang hoạt động bình thường"
    )
