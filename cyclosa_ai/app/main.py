from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from app.core.config import settings
from app.core.logging import setup_logging, logger
from app.core.exceptions import (
    CyclosaAiException,
    cyclosa_exception_handler,
    http_exception_handler,
    validation_exception_handler
)
from app.api.v1.router import api_v1_router

# Khởi tạo logging
setup_logging()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info(f"🚀 {settings.PROJECT_NAME} v{settings.VERSION} đã khởi động thành công!")
    logger.info(f"Môi trường: {settings.ENVIRONMENT} | Debug: {settings.DEBUG}")
    yield
    # Shutdown
    logger.info(f"🛑 {settings.PROJECT_NAME} đang dừng hoạt động...")


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Dedicated AI Microservice for CYCLOSA HRM (Tuyển dụng, Số hóa OCR, Chatbot RAG)",
    version=settings.VERSION,
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    lifespan=lifespan
)

# Cấu hình CORS nội bộ
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Đăng ký Exception Handlers chuẩn hóa
app.add_exception_handler(CyclosaAiException, cyclosa_exception_handler)
app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)

# Gắn kết router v1
app.include_router(api_v1_router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
