package com.cyclosa.reward.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Schema(description = "Yêu cầu phân công cán bộ điều tra khiếu nại")
public class AssignComplaintRequest {

    @NotNull(message = "ID cán bộ HR thụ lý không được để trống")
    @Schema(description = "ID nhân viên HR được phân công thụ lý")
    private UUID handlerEmployeeId;
}

