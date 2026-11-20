package com.cyclosa.offboarding.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OffboardingHandoverProtocolResponse {
    private UUID requestId;
    private UUID employeeId;
    private String employeeCode;
    private String employeeName;
    private String departmentName;
    private String positionName;
    private LocalDate actualLastWorkingDate;
    private String offboardingType;
    private String status;

    // Chỗ ngồi làm việc
    private ReleasedSeatDto releasedSeat;

    // Danh mục tài sản
    private List<HandoverAssetDto> assets;
    private int totalAssets;
    private int returnedAssets;
    private boolean allAssetsReturned;

    // Người phê duyệt & người kế nhiệm
    private String approverName;
    private LocalDateTime approvedAt;
    private String successorName;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReleasedSeatDto {
        private UUID seatId;
        private String seatCode;
        private String floorName;
        private String siteName;
        private String zoneName;
        private LocalDateTime assignedAt;
        private LocalDateTime releasedAt;
        private boolean isReleased;
        private String note;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HandoverAssetDto {
        private UUID assignmentId;
        private UUID assetId;
        private String assetCode;
        private String assetName;
        private String categoryName;
        private String serialNumber;
        private LocalDateTime assignedAt;
        private LocalDateTime returnedAt;
        private String conditionOnAssign;
        private String conditionOnReturn;
        private boolean isReturned;
    }
}
