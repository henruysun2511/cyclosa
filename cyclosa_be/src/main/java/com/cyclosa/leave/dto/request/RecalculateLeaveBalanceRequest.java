package com.cyclosa.leave.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Schema(description = "Yêu cầu tính lại quỹ phép năm cho nhân viên")
public class RecalculateLeaveBalanceRequest {

    @NotNull(message = "Năm tính quỹ không được để trống")
    @Schema(description = "Năm cần tính lại quỹ phép", example = "2026")
    private Integer year;

    @NotNull(message = "Loại nghỉ phép không được để trống")
    @Schema(description = "ID loại nghỉ phép cần tính lại")
    private UUID leaveTypeId;
}

