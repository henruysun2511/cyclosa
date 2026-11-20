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
public class RecruitmentDashboardResponse {

    // ── 4 KPIs ──
    private Long activeJobOpenings;
    private Long averageTimeToFillDays;
    private Long averageCostPerHire;
    private Long onboardingInProgress;

    // ── BIỂU ĐỒ ──
    private List<FunnelStagePoint> funnelStages;
    private List<SourceSharePoint> candidateSources;
    private List<OnboardingMilestonePoint> onboardingProgress;
    private List<UrgentJobOpeningSummary> urgentJobOpenings;

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FunnelStagePoint {
        private String stageKey;
        private String stageName;
        private Long count;
        private Double conversionRate; // % so với tầng trên
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SourceSharePoint {
        private String sourceName; // Website, LinkedIn, TopCV, Referral, Headhunter
        private Long count;
        private Double percentage;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OnboardingMilestonePoint {
        private String milestone; // Ngày đầu tiên, Tuần đầu, 30 ngày, 60 ngày
        private Long completedTasks;
        private Long pendingTasks;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UrgentJobOpeningSummary {
        private String jobTitle;
        private String departmentName;
        private Long applicantsCount;
        private Long daysOpen;
    }
}
