package com.cyclosa.dashboard.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PerformanceDashboardResponse {

    // ── 4 KPIs ──
    private Double cycleCompletionRate;
    private Double averageScore;
    private Double okrAchievementRate;
    private Long pipCount;

    // ── BIỂU ĐỒ ──
    private List<BellCurveGradePoint> bellCurveDistribution;
    private List<DepartmentPerformanceRank> departmentRanking;
    private List<NineBoxGridBoxPoint> nineBoxGridSummary;

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BellCurveGradePoint {
        private String grade; // A, B, C, D
        private String label; // Xuất sắc, Tốt, Đạt, Cần cải thiện
        private Double targetPercentage; // 10%, 40%, 40%, 10%
        private Double actualPercentage;
        private Long actualCount;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DepartmentPerformanceRank {
        private String departmentName;
        private Double averageScore;
        private Double completionRate;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NineBoxGridBoxPoint {
        private String boxKey; // high-high, mid-high, low-low...
        private String label; // Ngôi sao tương lai, Nòng cốt, ...
        private Long count;
        private Double percentage;
    }
}
