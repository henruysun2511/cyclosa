package com.cyclosa.performance.dto.request;

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
public class SelfAssessmentRequest {

    private String generalComment;

    private List<GoalSelfScoreItem> goalScores;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GoalSelfScoreItem {
        private UUID goalId;
        private BigDecimal selfScore;
        private String selfComment;
    }
}
