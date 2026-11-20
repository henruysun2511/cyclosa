from fastapi import APIRouter, Depends
from app.core.security import verify_internal_api_key
from app.modules.attendance.schemas import (
    FaceEnrollRequest, FaceEnrollResponse,
    FaceVerifyRequest, FaceVerifyResponse,
    AnomalyDetectRequest, AnomalyDetectResponse
)
from app.modules.attendance.service import AttendanceAiService

router = APIRouter(
    prefix="/attendance",
    tags=["Attendance AI"],
    dependencies=[Depends(verify_internal_api_key)]
)


@router.post(
    "/face/enroll",
    response_model=FaceEnrollResponse,
    summary="Đăng ký mẫu khuôn mặt ban đầu (Face Enrollment)",
    description="Trích xuất và chuẩn hóa vector embedding 512 số thực từ ảnh chân dung nhân viên lúc hoàn tất hồ sơ."
)
def enroll_employee_face(request: FaceEnrollRequest):
    result = AttendanceAiService.enroll_face(request)
    return FaceEnrollResponse.ok(data=result, message="Trích xuất vector khuôn mặt 512-dim thành công")


@router.post(
    "/face/verify",
    response_model=FaceVerifyResponse,
    summary="Xác thực khuôn mặt 1:1 và Kiểm tra người thật (Face Verification & Liveness)",
    description="So khớp ảnh webcam/mobile trực tiếp với mẫu khuôn mặt đã đăng ký của nhân viên và đánh giá nguy cơ gian lận."
)
def verify_employee_face(request: FaceVerifyRequest):
    result = AttendanceAiService.verify_face(request)
    return FaceVerifyResponse.ok(data=result, message="Xử lý xác thực khuôn mặt AI hoàn tất")


@router.post(
    "/anomaly/detect",
    response_model=AnomalyDetectResponse,
    summary="Phát hiện dị thường chấm công & GPS Spoofing",
    description="Phân tích tọa độ GPS, thời gian và lịch sử quẹt thẻ để phát hiện gian lận giả lập vị trí."
)
def detect_attendance_anomaly(request: AnomalyDetectRequest):
    result = AttendanceAiService.detect_anomaly(request)
    return AnomalyDetectResponse.ok(data=result, message="Phân tích bất thường chấm công hoàn tất")
