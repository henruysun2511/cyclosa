package com.cyclosa.attendance.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "Yêu cầu khóa kỳ công tháng")
public class LockTimesheetPeriodRequest {

    @Schema(description = "Ghi chú khi khóa kỳ (tùy chọn)", example = "Chốt công tháng 11/2026")
    private String note;
}

