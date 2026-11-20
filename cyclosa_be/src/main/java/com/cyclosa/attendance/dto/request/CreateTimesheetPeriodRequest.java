package com.cyclosa.attendance.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "Yêu cầu mở kỳ công tháng mới")
public class CreateTimesheetPeriodRequest {

    @NotNull(message = "Năm không được để trống")
    @Schema(description = "Năm công", example = "2026")
    private Integer year;

    @NotNull(message = "Tháng không được để trống")
    @Min(value = 1, message = "Tháng từ 1 đến 12")
    @Max(value = 12, message = "Tháng từ 1 đến 12")
    @Schema(description = "Tháng công (1 - 12)", example = "11")
    private Integer month;
}

