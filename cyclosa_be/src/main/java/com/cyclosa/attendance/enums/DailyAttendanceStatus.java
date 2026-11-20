package com.cyclosa.attendance.enums;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Trạng thái công hàng ngày (Derived State)")
public enum DailyAttendanceStatus {
    ON_TIME,
    LATE,
    EARLY,
    LATE_AND_EARLY,
    MISSING_CHECK_OUT,
    ABSENT,
    EXPLAINED,
    PAID_LEAVE,
    UNPAID_LEAVE,
    SICK_LEAVE,
    HOLIDAY,
    REST_DAY
}

