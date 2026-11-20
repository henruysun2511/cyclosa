package com.cyclosa.asset.dto.response;

import com.cyclosa.asset.enums.AssetCondition;
import com.cyclosa.asset.enums.AssetStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Thông tin chi tiết tài sản kèm lịch sử cấp phát")
public class AssetDetailResponse {

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
    private String specifications;
    private LocalDate purchaseDate;
    private BigDecimal purchasePrice;
    private AssetStatus status;
    private AssetCondition conditionStatus;
    private String location;
    private String notes;

    // Người đang giữ hiện tại
    private UUID currentEmployeeId;
    private String currentEmployeeCode;
    private String currentEmployeeName;
    private String currentDepartmentName;
    private LocalDateTime currentAssignedAt;
    private UUID currentAssignmentId;

    // Lịch sử cấp phát
    @Builder.Default
    private List<AssetAssignmentResponse> assignments = new ArrayList<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
