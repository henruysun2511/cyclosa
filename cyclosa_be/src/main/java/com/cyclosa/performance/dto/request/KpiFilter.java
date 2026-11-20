package com.cyclosa.performance.dto.request;

import com.cyclosa.common.dto.request.BaseFilterRequest;
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
public class KpiFilter extends BaseFilterRequest {
    private String search;
    private UUID departmentId;
    private Boolean isActive;
}
