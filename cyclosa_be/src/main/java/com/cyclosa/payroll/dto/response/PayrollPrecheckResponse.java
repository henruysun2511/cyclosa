package com.cyclosa.payroll.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PayrollPrecheckResponse {

    private Boolean isReady;
    private Integer totalEligibleEmployees;
    private Integer missingAttendanceEmployees;
    private Integer missingSalaryContractEmployees;
    private Integer pendingAdvancesCount;
    private List<String> warnings;
    private List<String> errors;
}

