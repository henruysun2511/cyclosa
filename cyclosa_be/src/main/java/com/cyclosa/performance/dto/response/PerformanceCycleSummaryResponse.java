package com.cyclosa.performance.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PerformanceCycleSummaryResponse {
    private UUID cycleId;
    private String cycleName;
    private long totalReviews;
    private long draftCount;
    private long selfReviewedCount;
    private long managerReviewedCount;
    private long finalizedCount;
    private double completionRate;
    private Map<String, Long> ratingDistribution; // EXCELLENT, GOOD, SATISFACTORY, NEEDS_IMPROVEMENT, POOR -> count
}
