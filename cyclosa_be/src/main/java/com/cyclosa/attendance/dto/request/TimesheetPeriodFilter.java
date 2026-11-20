package com.cyclosa.attendance.dto.request;

import com.cyclosa.attendance.enums.TimesheetPeriodStatus;
import com.cyclosa.common.dto.request.BaseFilterRequest;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "Tham số lọc danh sách kỳ công tháng")
public class TimesheetPeriodFilter extends BaseFilterRequest {

    @Schema(description = "Lọc theo năm", example = "2026")
    private Integer year;

    @Schema(description = "Lọc theo trạng thái (OPEN, LOCKED)")
    private TimesheetPeriodStatus status;
}

