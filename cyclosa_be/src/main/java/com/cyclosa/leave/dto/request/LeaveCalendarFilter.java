package com.cyclosa.leave.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@Schema(description = "Bộ lọc xem lịch nghỉ phép phòng ban")
public class LeaveCalendarFilter {

    @Schema(description = "ID phòng ban cần xem (để trống nếu xem toàn bộ phòng ban mình có quyền)")
    private UUID departmentId;

    @NotNull(message = "Từ ngày không được để trống")
    @Schema(description = "Từ ngày", example = "2026-05-01")
    private LocalDate from;

    @NotNull(message = "Đến ngày không được để trống")
    @Schema(description = "Đến ngày", example = "2026-05-31")
    private LocalDate to;
}

