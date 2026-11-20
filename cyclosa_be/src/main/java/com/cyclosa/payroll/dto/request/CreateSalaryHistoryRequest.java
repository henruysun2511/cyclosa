package com.cyclosa.payroll.dto.request;

import com.cyclosa.payroll.enums.SalaryChangeReason;
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
public class CreateSalaryHistoryRequest {

    @NotNull(message = "Nhân viên không được để trống")
    private UUID employeeId;

    private BigDecimal oldBaseSalary;

    @NotNull(message = "Mức lương cơ bản mới không được để trống")
    @DecimalMin(value = "0", message = "Mức lương không được âm")
    private BigDecimal newBaseSalary;

    private BigDecimal oldInsuranceSalary;

    private BigDecimal newInsuranceSalary;

    @NotNull(message = "Ngày hiệu lực không được để trống")
    private LocalDate effectiveDate;

    @NotNull(message = "Lý do thay đổi không được để trống")
    private SalaryChangeReason reason;

    private String decisionNumber;

    private UUID contractId;

    private String note;
}
