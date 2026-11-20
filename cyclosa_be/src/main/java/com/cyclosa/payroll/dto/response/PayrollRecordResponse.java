package com.cyclosa.payroll.dto.response;

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
public class PayrollRecordResponse {

    private UUID id;
    private UUID payrollPeriodId;
    private UUID employeeId;
    private String employeeName;
    private String employeeCode;
    private String departmentName;
    private String positionName;
    private String bankAccount;
    private String bankName;

    private UUID timesheetSnapshotId;
    private LocalDateTime calculatedAt;

    // Các chỉ số tính toán tổng hợp từ lines
    private BigDecimal baseSalary;
    private BigDecimal standardDays;
    private BigDecimal actualWorkDays;
    private BigDecimal otHours;
    private BigDecimal totalAllowances;
    private BigDecimal grossSalary;
    private BigDecimal employeeInsurance;
    private BigDecimal employerInsurance;
    private BigDecimal pitTax;
    private BigDecimal salaryAdvance;
    private BigDecimal otherDeductions;
    private BigDecimal netSalary;
    private BigDecimal totalEmployerCost;

    private Boolean hasManualAdjustment;
    private LocalDateTime updatedAt;
}
