package com.cyclosa.asset.dto.response;

import com.cyclosa.asset.enums.AssetCondition;
import com.cyclosa.asset.enums.AssetStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Thông tin tóm tắt tài sản")
public class AssetSummaryResponse {

    private UUID id;
    private UUID companyId;
    private String assetCode;
    private String name;
    private UUID categoryId;
    private String categoryName;
    private String categoryCode;
    private String serialNumber;
    private String model;
    private String manufacturer;
    private LocalDate purchaseDate;
    private BigDecimal purchasePrice;
    private AssetStatus status;
    private AssetCondition conditionStatus;
    private String location;

    // Thông tin người đang nắm giữ hiện tại (nếu có)
    private UUID currentEmployeeId;
    private String currentEmployeeCode;
    private String currentEmployeeName;
    private String currentDepartmentName;
    private LocalDateTime assignedAt;

    private LocalDateTime createdAt;
}
