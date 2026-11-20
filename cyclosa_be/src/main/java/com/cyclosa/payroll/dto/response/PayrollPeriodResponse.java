package com.cyclosa.payroll.dto.response;

import com.cyclosa.payroll.enums.PayrollPeriodStatus;
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
public class PayrollPeriodResponse {

    private UUID id;
    private String code;
    private String name;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate plannedPaymentDate;
    private BigDecimal standardWorkDays;
    private UUID timesheetPeriodId;
    private PayrollPeriodStatus status;
    private String note;

    // Các trường tổng hợp
    private Integer totalEmployees;
    private BigDecimal totalGross;
    private BigDecimal totalNet;
    private BigDecimal totalEmployerCost;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
