package com.cyclosa.dashboard.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PersonnelDashboardResponse {

    // ── 4 KPIs ──
    private Long activeEmployees;
    private Long probationEmployees;
    private Long expiringContractsCount;
    private Double averageTenureYears;

    // ── BIỂU ĐỒ ──
    private List<BranchSharePoint> branchDistribution;
    private List<ContractTypeSharePoint> contractTypeDistribution;
    private List<TenureGroupPoint> tenureDistribution;
    private List<ExpiringContractSummary> expiringContracts;

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BranchSharePoint {
        private UUID branchId;
        private String branchName;
        private Long employeeCount;
        private Double percentage;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ContractTypeSharePoint {
        private String contractType;
        private String label;
        private Long count;
        private Double percentage;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TenureGroupPoint {
        private String label; // < 1 năm, 1-3 năm, 3-5 năm, > 5 năm
        private Long count;
        private Double percentage;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ExpiringContractSummary {
        private UUID contractId;
        private String contractNumber;
        private String employeeName;
        private String employeeCode;
        private String contractType;
        private LocalDate expiryDate;
        private Long daysRemaining;
    }
}
