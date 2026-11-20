package com.cyclosa.payroll.dto.response;

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
public class PayrollAnomalyResponse {

    private UUID recordId;
    private UUID employeeId;
    private String employeeName;
    private String employeeCode;
    private String departmentName;
    private String anomalyType; // NET_DIFF_LARGE, NET_ZERO_OR_NEGATIVE, TAX_NEGATIVE, MISSING_ATTENDANCE
    private String message;
    private BigDecimal currentNet;
    private BigDecimal previousNet;
    private BigDecimal diffPercentage;
}
