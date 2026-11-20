import base64
from app.modules.attendance.router import (
    enroll_employee_face,
    verify_employee_face,
    detect_attendance_anomaly
)
from app.modules.attendance.schemas import (
    FaceEnrollRequest,
    FaceVerifyRequest,
    AnomalyDetectRequest
)


def test_face_enroll_success():
    fake_img = base64.b64encode(b"A" * 2048).decode("utf-8")
    req = FaceEnrollRequest(
        employee_id="emp-uuid-001",
        image_base64=fake_img
    )
    res = enroll_employee_face(req)
    assert res.success is True
    assert res.data.employee_id == "emp-uuid-001"
    assert res.data.dimension == 512
    assert res.data.quality_score >= 80.0


def test_face_verify_success():
    fake_img = base64.b64encode(b"A" * 2048).decode("utf-8")
    req = FaceVerifyRequest(
        employee_id="emp-uuid-001",
        live_image_base64=fake_img,
        enrolled_template_ref="https://res.cloudinary.com/cyclosa/face_sample.jpg",
        liveness_check=True,
        threshold=75.0
    )
    res = verify_employee_face(req)
    assert res.success is True
    assert res.data.is_matched is True
    assert res.data.verification_result == "SUCCESS"
    assert res.data.match_score >= 75.0


def test_face_verify_no_enrollment():
    fake_img = base64.b64encode(b"A" * 2048).decode("utf-8")
    req = FaceVerifyRequest(
        employee_id="emp-uuid-002",
        live_image_base64=fake_img,
        enrolled_template_ref=None,
        liveness_check=True
    )
    res = verify_employee_face(req)
    assert res.success is True
    assert res.data.is_matched is False
    assert res.data.verification_result == "NO_ENROLLMENT"


def test_face_verify_liveness_failed():
    fake_img = base64.b64encode(b"A" * 2048).decode("utf-8") + "test_spoof"
    req = FaceVerifyRequest(
        employee_id="emp-uuid-003",
        live_image_base64=fake_img,
        enrolled_template_ref="some_ref",
        liveness_check=True
    )
    res = verify_employee_face(req)
    assert res.success is True
    assert res.data.is_live is False
    assert res.data.verification_result == "LIVENESS_FAILED"


def test_anomaly_detect_teleportation():
    req = AnomalyDetectRequest(
        employee_id="emp-uuid-004",
        latitude=21.028511,  # Hà Nội
        longitude=105.854444,
        occurred_at="2026-11-15T08:05:00Z",
        history_points=[
            {
                "latitude": 10.823099,  # TP.HCM
                "longitude": 106.629664,
                "occurred_at": "2026-11-15T08:00:00Z"
            }
        ]
    )
    res = detect_attendance_anomaly(req)
    assert res.success is True
    assert res.data.is_suspicious is True
    assert len(res.data.risk_factors) > 0
