from fastapi import APIRouter
from app.api.v1.health import router as health_router
from app.modules.recruitment.router import router as recruitment_router
from app.modules.attendance.router import router as attendance_router
from app.modules.ocr.router import router as ocr_router
from app.modules.assistant.router import router as assistant_router

api_v1_router = APIRouter(prefix="/api/v1")

# Gắn kết các endpoints
api_v1_router.include_router(health_router)
api_v1_router.include_router(recruitment_router)
api_v1_router.include_router(attendance_router)
api_v1_router.include_router(ocr_router)
api_v1_router.include_router(assistant_router)

