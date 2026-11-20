package com.cyclosa.restructure.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WhatIfImpactAnalysisResponse {

    private UUID scenarioId;

    // 1. Biến động nhân sự
    private long asIsHeadcount;
    private long toBeHeadcount;
    private long deltaHeadcount;
    private long transferredCount;
    private long promotedCount;
    private long redundantCount;

    // 2. Tác động chi phí quỹ lương
    private BigDecimal asIsMonthlyPayroll;
    private BigDecimal toBeMonthlyPayroll;
    private BigDecimal deltaMonthlyPayroll;
    private BigDecimal deltaAnnualPayroll;

    // 3. Chỉ số kiểm soát và phân tầng
    private double asIsAverageSpanOfControl;
    private double toBeAverageSpanOfControl;
    private int asIsMaxHierarchyDepth;
    private int toBeMaxHierarchyDepth;

    // 4. Chi tiết biến động theo từng phòng ban
    private List<DepartmentImpactItem> departmentImpacts;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DepartmentImpactItem {
        private UUID departmentId;
        private String departmentName;
        private long asIsHeadcount;
        private long toBeHeadcount;
        private long deltaHeadcount;
        private Integer targetHeadcount;
        private boolean isOverCapacity;
    }
}
