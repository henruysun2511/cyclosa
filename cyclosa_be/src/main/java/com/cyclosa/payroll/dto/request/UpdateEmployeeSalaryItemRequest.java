package com.cyclosa.payroll.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateEmployeeSalaryItemRequest {

    @NotNull(message = "Số tiền không được để trống")
    @DecimalMin(value = "0", message = "Số tiền không được âm")
    private BigDecimal amount;

    private LocalDate effectiveDate;

    private LocalDate expiryDate;

    private Boolean isActive;

    private String note;
}

