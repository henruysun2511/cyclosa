package com.cyclosa.dashboard.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExecutiveDashboardResponse {

    // ── 4 KPIs ──
    private Long totalEmployees;
    private Double employeeGrowthPercentage;
    private Double turnoverRate;
    private Double turnoverComparison;
    private Double overallAttendanceRate;
    private Double attendanceComparison;
    private Long estimatedMonthlyPayroll;
    private String formattedPayroll;

    // ── BIỂU ĐỒ ──
    private List<HeadcountTrendPoint> headcountTrend;
    private List<DepartmentSharePoint> departmentDistribution;
    private GenderDistribution genderDistribution;
    private List<ExecutiveWatchlistItem> executiveWatchlist;

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HeadcountTrendPoint {
        private String period; // T1, T2, ...
        private Long count;
        private Long joined;
        private Long left;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DepartmentSharePoint {
        private UUID departmentId;
        private String departmentName;
        private Long employeeCount;
        private Double percentage;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GenderDistribution {
        private Long maleCount;
        private Long femaleCount;
        private Long otherCount;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ExecutiveWatchlistItem {
        private String title;
        private Long count;
        private String severity; // CRITICAL, WARNING, INFO
        private String targetUrl;
    }
}
