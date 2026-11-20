package com.cyclosa.attendance.enums;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Loại lý do làm đơn giải trình chấm công")
public enum AttendanceRequestType {
    FORGOT_PUNCH,
    TIME_DEVIATION,
    DEVICE_FAILURE,
    BUSINESS_TRIP,
    OTHER
}

