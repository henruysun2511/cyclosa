package com.cyclosa.workplace.dto.response;

import com.cyclosa.workplace.enums.SeatShape;
import com.cyclosa.workplace.enums.SeatStatus;
import com.cyclosa.workplace.enums.SeatType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class WorkplaceSeatDetailResponse {
    private UUID id;
    private UUID seatRowId;
    private String seatRowCode;
    private UUID zoneId;
    private String zoneName;
    private UUID floorId;
    private String floorName;
    private UUID siteId;
    private String siteName;
    private String seatCode;
    private SeatType seatType;
    private SeatStatus status;
    private BigDecimal x;
    private BigDecimal y;
    private SeatShape shape;
    private BigDecimal width;
    private BigDecimal height;
    private BigDecimal rotationDegrees;
    private String qrToken;

    // Current occupant if dedicated or hot-desk
    private UUID currentEmployeeId;
    private String currentEmployeeName;
    private String currentEmployeeCode;
    private String currentEmployeeDepartment;
    private String currentEmployeeAvatar;

    private List<AmenityDto> amenities;
    private List<SeatAssetDto> linkedAssets;

    @Data
    @Builder
    public static class AmenityDto {
        private UUID id;
        private String name;
        private String iconName;
    }

    @Data
    @Builder
    public static class SeatAssetDto {
        private UUID id;
        private UUID assetId;
        private String assetCode;
        private String assetName;
        private String serialNumber;
    }
}
