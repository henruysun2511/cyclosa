package com.cyclosa.payroll.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PayslipResponse {

    private UUID id;
    private UUID employeeId;
    private String employeeName;
    private String employeeCode;
    private String departmentName;
    private String positionName;
    private UUID payrollPeriodId;
    private String payrollPeriodCode;
    private String payrollPeriodName;
    private LocalDate startDate;
    private LocalDate endDate;

    private BigDecimal grossSalary;
    private BigDecimal totalAllowances;
    private BigDecimal employeeInsurance;
    private BigDecimal pitTax;
    private BigDecimal salaryAdvance;
    private BigDecimal netSalary;

    private UUID fileId;
    private String fileUrl;
    private LocalDateTime issuedAt;

    private List<PayrollRecordLineResponse> lines;
}
