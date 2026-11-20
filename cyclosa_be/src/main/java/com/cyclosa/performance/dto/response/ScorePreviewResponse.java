package com.cyclosa.performance.dto.response;

import com.cyclosa.performance.enums.PerformanceRating;
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
public class ScorePreviewResponse {
    private UUID reviewId;
    private BigDecimal calculatedScore;
    private PerformanceRating calculatedRating;
    private BigDecimal totalWeight;
    private int totalGoals;
    private int evaluatedGoalsCount;
    private boolean isReadyToFinalize;
    private String validationMessage;
}
