package com.cyclosa.payroll.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
public class ManualAdjustmentRequest {

    private UUID lineId;

    private UUID salaryComponentId;

    private String title;

    @NotNull(message = "Số tiền không được để trống")
    @DecimalMin(value = "0", message = "Số tiền không được âm")
    private BigDecimal amount;

    @NotBlank(message = "Lý do điều chỉnh thủ công là bắt buộc")
    @Size(min = 5, max = 500, message = "Lý do điều chỉnh từ 5 đến 500 ký tự")
    private String reason;
}
