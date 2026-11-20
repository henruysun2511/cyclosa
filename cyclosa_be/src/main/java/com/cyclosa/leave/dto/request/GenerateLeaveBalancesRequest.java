package com.cyclosa.leave.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Schema(description = "Yêu cầu cấp quỹ phép năm cho nhân viên")
public class GenerateLeaveBalancesRequest {

    @NotNull(message = "Năm cấp quỹ phép không được để trống")
    @Schema(description = "Năm cấp quỹ phép", example = "2026")
    private Integer year;

    @Schema(description = "Danh sách ID nhân viên được chọn để cấp (để trống nếu cấp toàn bộ công ty)")
    private List<UUID> employeeIds;

    @Schema(description = "Ghi chú cấp quỹ")
    private String notes;
}

