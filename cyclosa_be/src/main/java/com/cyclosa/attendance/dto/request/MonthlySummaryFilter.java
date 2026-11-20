package com.cyclosa.attendance.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Schema(description = "Tham số tra cứu bảng công tháng thời gian thực")
public class MonthlySummaryFilter {

    @NotNull(message = "Năm không được để trống")
    @Schema(description = "Năm công", example = "2026")
    private Integer year;

    @NotNull(message = "Tháng không được để trống")
    @Min(value = 1, message = "Tháng từ 1 đến 12")
    @Max(value = 12, message = "Tháng từ 1 đến 12")
    @Schema(description = "Tháng công (1 - 12)", example = "11")
    private Integer month;

    @Schema(description = "Lọc theo phòng ban")
    private UUID departmentId;

    @Schema(description = "Lọc theo nhân viên cụ thể")
    private UUID employeeId;
}

