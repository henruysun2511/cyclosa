package com.cyclosa.payroll.dto.response;

import com.cyclosa.payroll.enums.SalaryChangeReason;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalaryHistoryResponse {

    private UUID id;
    private UUID employeeId;
    private String employeeName;
    private String employeeCode;
    private BigDecimal baseSalary;
    private BigDecimal insuranceSalary;
    private LocalDate effectiveFrom;
    private SalaryChangeReason reason;
    private String decisionNo;
    private UUID contractId;
    private UUID contractAppendixId;
    private String note;
    private LocalDateTime createdAt;
}
