from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from app.common.schemas.response import ApiResponse


class FaceEnrollRequest(BaseModel):
    employee_id: str = Field(..., description="ID nhân viên cần đăng ký khuôn mặt")
    image_base64: str = Field(..., description="Ảnh chân dung nhân viên dạng Base64")


class FaceEnrollResult(BaseModel):
    employee_id: str = Field(..., description="ID nhân viên")
    embedding: List[float] = Field(..., description="Vector đặc trưng 512 số thực")
    dimension: int = Field(512, description="Số chiều của vector đặc trưng")
    quality_score: float = Field(..., description="Điểm chất lượng ảnh chân dung (0 - 100)")


class FaceVerifyRequest(BaseModel):
    employee_id: str = Field(..., description="ID nhân viên cần xác thực")
    live_image_base64: str = Field(..., description="Ảnh chụp trực tiếp từ webcam/mobile dạng Base64")
    enrolled_embedding: Optional[List[float]] = Field(None, description="Vector embedding 512-dim đã lưu trong CSDL")
    enrolled_template_ref: Optional[str] = Field(None, description="URL hoặc tham chiếu mẫu ảnh/vector đã đăng ký")
    enrolled_image_base64: Optional[str] = Field(None, description="Ảnh đăng ký gốc dạng Base64 (nếu có)")
    liveness_check: bool = Field(True, description="Có yêu cầu kiểm tra chống giả mạo liveness không")
    threshold: float = Field(75.0, description="Ngưỡng chấp thuận điểm so khớp (0 - 100)")


class FaceVerifyResult(BaseModel):
    is_matched: bool = Field(..., description="Khuôn mặt có khớp với mẫu không")
    match_score: float = Field(..., description="Điểm so khớp 1:1 từ 0 đến 100")
    is_live: bool = Field(..., description="Xác thực người thật (liveness) thành công")
    verification_result: str = Field(..., description="Mã kết quả: SUCCESS, FACE_MISMATCH, LIVENESS_FAILED, LOW_IMAGE_QUALITY, NO_ENROLLMENT")
    details: Optional[str] = Field(None, description="Mô tả chi tiết kết quả đánh giá AI")


class AnomalyDetectRequest(BaseModel):
    employee_id: str = Field(..., description="ID nhân viên")
    latitude: float = Field(..., description="Vĩ độ quẹt thẻ")
    longitude: float = Field(..., description="Kinh độ quẹt thẻ")
    occurred_at: str = Field(..., description="Thời điểm quẹt thẻ định dạng ISO-8601")
    history_points: Optional[List[Dict[str, Any]]] = Field(None, description="Lịch sử các lần quẹt trước đó trong ngày")


class AnomalyDetectResult(BaseModel):
    is_suspicious: bool = Field(..., description="Có dấu hiệu bất thường hoặc gian lận không")
    confidence_score: float = Field(..., description="Độ tin cậy của cảnh báo bất thường (0 - 100)")
    risk_factors: List[str] = Field(default_factory=list, description="Danh sách các yếu tố rủi ro phát hiện được")


FaceEnrollResponse = ApiResponse[FaceEnrollResult]
FaceVerifyResponse = ApiResponse[FaceVerifyResult]
AnomalyDetectResponse = ApiResponse[AnomalyDetectResult]
