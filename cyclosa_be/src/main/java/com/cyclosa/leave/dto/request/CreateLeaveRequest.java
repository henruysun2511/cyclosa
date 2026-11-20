package com.cyclosa.leave.dto.request;

import com.cyclosa.leave.enums.DayPortion;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@Schema(description = "Yêu cầu tạo đơn xin nghỉ phép")
public class CreateLeaveRequest {

    @Schema(description = "ID nhân viên xin nghỉ (HR có thể tạo thay nhân viên; để trống nếu tự tạo cho mình)")
    private UUID employeeId;

    @NotNull(message = "Loại nghỉ phép không được để trống")
    @Schema(description = "ID loại nghỉ phép")
    private UUID leaveTypeId;

    @NotNull(message = "Ngày bắt đầu nghỉ không được để trống")
    @Schema(description = "Ngày bắt đầu nghỉ", example = "2026-05-02")
    private LocalDate startDate;

    @NotNull(message = "Ngày kết thúc nghỉ không được để trống")
    @Schema(description = "Ngày kết thúc nghỉ", example = "2026-05-04")
    private LocalDate endDate;

    @NotNull(message = "Buổi nghỉ không được để trống")
    @Schema(description = "Buổi nghỉ (FULL_DAY, MORNING, AFTERNOON)")
    private DayPortion dayPortion = DayPortion.FULL_DAY;

    @Schema(description = "Lý do xin nghỉ phép")
    private String reason;
}

