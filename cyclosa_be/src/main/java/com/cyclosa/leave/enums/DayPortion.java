package com.cyclosa.leave.enums;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Buổi nghỉ trong ngày")
public enum DayPortion {
    @Schema(description = "Nghỉ nguyên ngày (1.0 ngày)")
    FULL_DAY,

    @Schema(description = "Nghỉ buổi sáng (0.5 ngày)")
    MORNING,

    @Schema(description = "Nghỉ buổi chiều (0.5 ngày)")
    AFTERNOON
}

