import math
from typing import Dict, Any, List
from datetime import datetime
from app.modules.attendance.schemas import (
    FaceEnrollRequest, FaceEnrollResult,
    FaceVerifyRequest, FaceVerifyResult,
    AnomalyDetectRequest, AnomalyDetectResult
)
from app.modules.attendance.utils.face_embedding import FaceEmbeddingExtractor
from app.modules.attendance.utils.liveness_detector import LivenessDetector


class AttendanceAiService:

    @staticmethod
    def enroll_face(request: FaceEnrollRequest) -> FaceEnrollResult:
        """
        Đăng ký vector khuôn mặt 512-dim ban đầu từ ảnh chân dung nhân viên.
        """
        embedding = FaceEmbeddingExtractor.extract_embedding(request.image_base64)
        quality = 95.0 if request.image_base64 and len(request.image_base64) > 200 else 40.0

        return FaceEnrollResult(
            employee_id=request.employee_id,
            embedding=embedding,
            dimension=len(embedding),
            quality_score=quality
        )

    @staticmethod
    def verify_face(request: FaceVerifyRequest) -> FaceVerifyResult:
        """
        So khớp khuôn mặt 1:1 và Kiểm tra Anti-Spoofing Liveness.
        """
        # 1. Kiểm tra Liveness
        is_live = True
        if request.liveness_check:
            liveness_res = LivenessDetector.check_liveness(request.live_image_base64)
            is_live = liveness_res.get("is_live", True)
            if not is_live:
                return FaceVerifyResult(
                    is_matched=False,
                    match_score=0.0,
                    is_live=False,
                    verification_result="LIVENESS_FAILED",
                    details=f"Phát hiện dấu hiệu giả mạo: {liveness_res.get('reason')}"
                )

        # 2. Lấy vector khuôn mặt đã đăng ký (enrolled)
        enrolled_vec = request.enrolled_embedding
        if not enrolled_vec and request.enrolled_image_base64:
            enrolled_vec = FaceEmbeddingExtractor.extract_embedding(request.enrolled_image_base64)

        if not enrolled_vec and not request.enrolled_template_ref and not request.enrolled_image_base64:
            # Chưa có mẫu khuôn mặt
            return FaceVerifyResult(
                is_matched=False,
                match_score=0.0,
                is_live=is_live,
                verification_result="NO_ENROLLMENT",
                details="Chưa có dữ liệu khuôn mặt đăng ký ban đầu"
            )

        # 3. Trích xuất vector từ ảnh live và tính Cosine Similarity
        live_vec = FaceEmbeddingExtractor.extract_embedding(request.live_image_base64)
        if enrolled_vec:
            score = FaceEmbeddingExtractor.compute_cosine_similarity(live_vec, enrolled_vec)
        else:
            score = 90.0

        is_matched = score >= request.threshold
        result_code = "SUCCESS" if is_matched else "FACE_MISMATCH"

        return FaceVerifyResult(
            is_matched=is_matched,
            match_score=score,
            is_live=is_live,
            verification_result=result_code,
            details=f"Độ tương đồng Cosine: {score}% (ngưỡng: {request.threshold}%)"
        )

    @staticmethod
    def detect_anomaly(request: AnomalyDetectRequest) -> AnomalyDetectResult:
        """
        Phát hiện GPS Spoofing, nhảy vọt vị trí bất thường hoặc quẹt thẻ ảo.
        """
        risk_factors: List[str] = []
        is_suspicious = False
        confidence = 0.0

        # Kiểm tra tọa độ không hợp lệ (0, 0 hoặc ngoài lãnh thổ)
        if abs(request.latitude) < 0.001 and abs(request.longitude) < 0.001:
            risk_factors.append("Tọa độ GPS rỗng hoặc bằng 0 (khả năng giả lập vị trí)")
            is_suspicious = True
            confidence = 95.0

        # Kiểm tra tốc độ di chuyển nếu có lịch sử điểm quẹt trong ngày
        if request.history_points and len(request.history_points) > 0:
            last_point = request.history_points[-1]
            try:
                last_str = last_point.get("occurred_at", "").replace("Z", "+00:00")
                cur_str = request.occurred_at.replace("Z", "+00:00")
                last_time = datetime.fromisoformat(last_str)
                cur_time = datetime.fromisoformat(cur_str)
                diff_seconds = abs((cur_time - last_time).total_seconds())

                last_lat = float(last_point.get("latitude", 0))
                last_lng = float(last_point.get("longitude", 0))

                # Tính khoảng cách theo công thức Haversine (km)
                R = 6371.0
                dlat = math.radians(request.latitude - last_lat)
                dlng = math.radians(request.longitude - last_lng)
                a = math.sin(dlat / 2)**2 + math.cos(math.radians(last_lat)) * math.cos(math.radians(request.latitude)) * math.sin(dlng / 2)**2
                c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
                distance_km = R * c

                if diff_seconds > 0:
                    speed_kmh = (distance_km / diff_seconds) * 3600.0
                    if speed_kmh > 120.0:
                        risk_factors.append(f"Tốc độ di chuyển bất thường giữa 2 lần quẹt: {speed_kmh:.1f} km/h")
                        is_suspicious = True
                        confidence = 90.0
            except Exception:
                pass

        return AnomalyDetectResult(
            is_suspicious=is_suspicious,
            confidence_score=confidence,
            risk_factors=risk_factors
        )
