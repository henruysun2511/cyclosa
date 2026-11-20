package com.cyclosa.performance.dto.request;

import com.cyclosa.common.dto.request.BaseFilterRequest;
import com.cyclosa.performance.enums.PerformanceCycleStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PerformanceCycleFilter extends BaseFilterRequest {
    private String search;
    private PerformanceCycleStatus status;
    private Integer year;
}
