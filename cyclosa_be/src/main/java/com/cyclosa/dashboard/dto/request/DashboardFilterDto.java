package com.cyclosa.dashboard.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
public class DashboardFilterDto {

    @Schema(description = "Khoảng thời gian: DAY, WEEK, MONTH, QUARTER, YEAR, ALL", example = "MONTH")
    private String period = "MONTH";

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    @Schema(description = "Ngày bắt đầu (tùy chọn)", example = "2026-01-01")
    private LocalDate startDate;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    @Schema(description = "Ngày kết thúc (tùy chọn)", example = "2026-12-31")
    private LocalDate endDate;

    @Schema(description = "Lọc theo chi nhánh cụ thể", example = "11111111-1111-1111-1111-111111111111")
    private UUID branchId;

    @Schema(description = "Lọc theo phòng ban cụ thể", example = "22222222-2222-2222-2222-222222222222")
    private UUID departmentId;
}
