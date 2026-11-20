package com.cyclosa.attendance.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Schema(description = "Yêu cầu phân ca làm việc hàng loạt cho danh sách nhân viên")
public class BulkShiftAssignmentRequest {

    @NotEmpty(message = "Danh sách ID nhân viên không được để trống")
    @Schema(description = "Danh sách ID nhân viên được phân ca")
    private List<UUID> employeeIds;

    @NotNull(message = "ID ca làm việc không được để trống")
    @Schema(description = "ID ca làm việc được chỉ định")
    private UUID shiftId;

    @NotNull(message = "Ngày bắt đầu áp dụng không được để trống")
    @Schema(description = "Ngày bắt đầu (YYYY-MM-DD)", example = "2026-11-01")
    private LocalDate startDate;

    @NotNull(message = "Ngày kết thúc áp dụng không được để trống")
    @Schema(description = "Ngày kết thúc (YYYY-MM-DD)", example = "2026-11-30")
    private LocalDate endDate;

    @Schema(description = "Bỏ qua ngày thứ 7 và Chủ nhật", example = "true")
    private Boolean excludeWeekends = true;
}

