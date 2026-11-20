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
public class ManagerAssessmentRequest {

    private String generalComment;

    private List<GoalManagerScoreItem> goalScores;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GoalManagerScoreItem {
        private UUID goalId;
        private BigDecimal managerScore;
        private String managerComment;
    }
}
