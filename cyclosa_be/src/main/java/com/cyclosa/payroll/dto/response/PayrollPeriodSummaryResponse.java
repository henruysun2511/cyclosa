package com.cyclosa.payroll.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PayrollPeriodSummaryResponse {

    private UUID periodId;
    private String periodCode;
    private String periodName;
    private Integer totalEmployees;
    private BigDecimal totalGross;
    private BigDecimal totalNet;
    private BigDecimal totalEmployerCost;
    private BigDecimal totalEmployeeInsurance;
    private BigDecimal totalEmployerInsurance;
    private BigDecimal totalPitTax;
    private BigDecimal totalAdvanceDeducted;
    private BigDecimal totalPaid;
    private BigDecimal totalPendingPayment;

    // Phân tích so sánh với kỳ trước
    private BigDecimal diffGrossPercentage;
    private BigDecimal diffNetPercentage;
    private Integer anomalyCount;

    private List<PayrollAnomalyResponse> anomalies;
}
