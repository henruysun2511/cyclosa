package com.cyclosa.workplace.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateFloorPlanRequest {
    private String backgroundFileUrl;

    @NotNull(message = "Chiều rộng canvas không được để trống")
    private Integer canvasWidth = 1920;

    @NotNull(message = "Chiều cao canvas không được để trống")
    private Integer canvasHeight = 1080;

    @NotNull(message = "Tỷ lệ mét/pixel không được để trống")
    private BigDecimal scaleMetersPerPx = BigDecimal.valueOf(0.05);
}
