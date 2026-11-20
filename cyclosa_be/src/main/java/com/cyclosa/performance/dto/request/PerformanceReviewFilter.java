package com.cyclosa.performance.dto.request;

import com.cyclosa.common.dto.request.BaseFilterRequest;
import com.cyclosa.performance.enums.ReviewStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@EqualsAndHashCode(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PerformanceReviewFilter extends BaseFilterRequest {
    private String search;
    private UUID cycleId;
    private UUID employeeId;
    private UUID departmentId;
    private ReviewStatus status;
}
