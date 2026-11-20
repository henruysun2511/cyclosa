package com.cyclosa.attendance.enums;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Kết quả xác thực chấm công (Face AI & GPS Geofencing)")
public enum VerificationResult {
    SUCCESS,
    OUT_OF_RANGE,
    FACE_MISMATCH,
    LIVENESS_FAILED,
    NO_ENROLLMENT,
    LOW_IMAGE_QUALITY,
    DUPLICATE_OR_SEQUENCE_ERROR
}

