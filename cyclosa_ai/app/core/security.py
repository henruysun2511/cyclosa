from fastapi import Security, HTTPException, status
from fastapi.security.api_key import APIKeyHeader
from app.core.config import settings

API_KEY_NAME = "X-Internal-API-Key"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)


def verify_internal_api_key(
    api_key: str = Security(api_key_header)
) -> str:
    """
    Validate that incoming requests carry the correct secret X-Internal-API-Key header.
    Only allows internal backend services (such as cyclosa_be) to invoke AI endpoints.
    """
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Thiếu header xác thực nội bộ X-Internal-API-Key"
        )
    # Cho phép cả mã chuẩn nội bộ và mã fallback của backend
    valid_keys = {
        settings.INTERNAL_API_KEY,
        "cyclosa-internal-ai-secret-key-2026",
        "cyclosa-ai-secret-key-2026"
    }
    if api_key not in valid_keys:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Mã X-Internal-API-Key không hợp lệ hoặc không có quyền truy cập"
        )
    return api_key
