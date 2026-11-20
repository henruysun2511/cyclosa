package com.cyclosa.offboarding.dto.request;

import com.cyclosa.asset.enums.AssetCondition;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReturnOffboardingAssetsRequest {
    private AssetCondition conditionOnReturn;
    private String notes;
    private List<UUID> specificAssignmentIds;
}
