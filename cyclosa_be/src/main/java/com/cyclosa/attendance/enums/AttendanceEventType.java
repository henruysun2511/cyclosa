package com.cyclosa.attendance.enums;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Loại sự kiện chấm công (Vào / Ra)")
public enum AttendanceEventType {
    CHECK_IN,
    CHECK_OUT
}

