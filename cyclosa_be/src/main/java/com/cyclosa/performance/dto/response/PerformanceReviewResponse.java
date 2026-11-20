package com.cyclosa.performance.dto.response;

import com.cyclosa.performance.enums.PerformanceRating;
import com.cyclosa.performance.enums.ReviewStatus;
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
public class PerformanceReviewResponse {
    private UUID id;
    private UUID cycleId;
    private String cycleName;
    private UUID employeeId;
    private String employeeCode;
    private String employeeName;
    private String departmentName;
    private String jobTitleName;
    private UUID managerEmployeeId;
    private String managerEmployeeName;
    private ReviewStatus status;
    private BigDecimal finalScore;
    private PerformanceRating finalRating;
    private Integer totalGoals;
    private BigDecimal totalWeight;
    private LocalDateTime selfSubmittedAt;
    private LocalDateTime managerSubmittedAt;
    private LocalDateTime finalizedAt;
    private LocalDateTime createdAt;
}
