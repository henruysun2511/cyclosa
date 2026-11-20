package com.cyclosa.payroll.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateEmployeeSalaryItemRequest {

    @NotNull(message = "Nhân viên không được để trống")
    private UUID employeeId;

    @NotNull(message = "Khoản lương không được để trống")
    private UUID salaryComponentId;

    @NotNull(message = "Số tiền không được để trống")
    @DecimalMin(value = "0", message = "Số tiền không được âm")
    private BigDecimal amount;

    private LocalDate effectiveFrom;

    private LocalDate effectiveTo;

    private UUID payrollPeriodId;
}
