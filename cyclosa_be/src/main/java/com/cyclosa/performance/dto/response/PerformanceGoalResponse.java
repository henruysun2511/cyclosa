package com.cyclosa.performance.dto.response;

import com.cyclosa.performance.enums.GoalStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PerformanceGoalResponse {
    private UUID id;
    private UUID reviewId;
    private String name;
    private BigDecimal targetValue;
    private UUID kpiId;
    private String kpiName;
    private String kpiUnit;
    private BigDecimal weight;
    private GoalStatus status;
    private BigDecimal selfScore;
    private String selfComment;
    private BigDecimal managerScore;
    private String managerComment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
