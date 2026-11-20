package com.cyclosa.performance.dto.response;

import com.cyclosa.performance.enums.PerformanceRating;
import com.cyclosa.performance.enums.ReviewStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PerformanceReviewDetailResponse {
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
    private String selfComment;
    private String managerComment;
    private LocalDateTime selfSubmittedAt;
    private LocalDateTime managerSubmittedAt;
    private BigDecimal finalScore;
    private PerformanceRating finalRating;
    private UUID finalizedByUserId;
    private LocalDateTime finalizedAt;
    private List<PerformanceGoalResponse> goals;
    private BigDecimal totalWeight;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
