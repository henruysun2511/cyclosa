package com.cyclosa.payroll.dto.response;

import com.cyclosa.payroll.enums.SalaryAdvanceStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalaryAdvanceResponse {

    private UUID id;
    private UUID employeeId;
    private String employeeName;
    private String employeeCode;
    private String departmentName;
    private BigDecimal amount;
    private String reason;
    private LocalDateTime requestedAt;
    private SalaryAdvanceStatus status;
    private LocalDateTime disbursedAt;
    private UUID recoveryPayrollPeriodId;
    private String recoveryPayrollPeriodName;
    private LocalDateTime createdAt;
}
