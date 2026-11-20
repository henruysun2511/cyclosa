package com.cyclosa.attendance.enums;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Trạng thái kỳ công tháng (Mở / Đã khóa)")
public enum TimesheetPeriodStatus {
    OPEN,
    LOCKED
}

