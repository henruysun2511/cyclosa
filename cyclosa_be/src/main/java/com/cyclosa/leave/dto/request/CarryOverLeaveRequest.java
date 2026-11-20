package com.cyclosa.leave.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "Yêu cầu kết chuyển phép tồn sang năm sau")
public class CarryOverLeaveRequest {

    @NotNull(message = "Năm nguồn không được để trống")
    @Schema(description = "Năm chuyển đi (phép tồn năm này chuyển sang năm + 1)", example = "2025")
    private Integer fromYear;
}

