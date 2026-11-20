package com.cyclosa.asset.dto.response;

import com.cyclosa.asset.enums.AssetCondition;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Thông tin lượt cấp phát / thu hồi tài sản")
public class AssetAssignmentResponse {

    private UUID id;
    private UUID assetId;
    private String assetCode;
    private String assetName;
    private String categoryName;
    private UUID employeeId;
    private String employeeCode;
    private String employeeName;
    private String departmentName;
    private LocalDateTime assignedAt;
    private LocalDateTime returnedAt;
    private AssetCondition conditionOnAssign;
    private AssetCondition conditionOnReturn;
    private String notes;
    private boolean active;
}
