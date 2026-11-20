package com.cyclosa.performance.dto.request;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateGoalRequest {

    @NotBlank(message = "Tên mục tiêu không được để trống")
    private String name;

    private BigDecimal targetValue;

    private UUID kpiId;

    @NotNull(message = "Trọng số không được để trống")
    @DecimalMin(value = "0.01", message = "Trọng số tối thiểu là 0.01%")
    @DecimalMax(value = "100.00", message = "Trọng số tối đa là 100%")
    private BigDecimal weight;
}
