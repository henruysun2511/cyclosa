package com.cyclosa.attendance.enums;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Loại ngày làm thêm giờ (OT) theo Bộ luật Lao động")
public enum OvertimeDayType {
    NORMAL_DAY,      // Ngày thường (150%)
    WEEKEND,         // Ngày nghỉ hàng tuần (200%)
    PUBLIC_HOLIDAY   // Ngày nghỉ lễ, Tết (300%)
}

