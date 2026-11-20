from pydantic import BaseModel
from typing import Generic, TypeVar, Optional, Any

T = TypeVar("T")


class ApiResponse(BaseModel, Generic[T]):
    success: bool = True
    code: int = 200
    message: str = "Thành công"
    data: Optional[T] = None
    errorCode: Optional[str] = None

    @classmethod
    def ok(cls, data: T, message: str = "Thành công") -> "ApiResponse[T]":
        return cls(success=True, code=200, message=message, data=data, errorCode=None)

    @classmethod
    def error(cls, message: str, code: int = 400, error_code: str = "BAD_REQUEST") -> "ApiResponse[Any]":
        return cls(success=False, code=code, message=message, data=None, errorCode=error_code)

