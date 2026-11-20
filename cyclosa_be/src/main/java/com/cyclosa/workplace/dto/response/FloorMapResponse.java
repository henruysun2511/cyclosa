package com.cyclosa.workplace.dto.response;

import com.cyclosa.workplace.enums.FloorObjectType;
import com.cyclosa.workplace.enums.RowLayoutType;
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
public class FloorMapResponse {
    private UUID floorId;
    private String floorName;
    private Integer floorNumber;
    private WorkplaceFloorPlanResponse activePlan;
    private List<ZoneDto> zones;
    private List<SeatRowDto> seatRows;
    private List<SeatDto> seats;
    private List<FloorObjectDto> objects;

    @Data
    @Builder
    public static class ZoneDto {
        private UUID id;
        private String name;
        private UUID departmentId;
        private String departmentName;
        private String colorHex;
        private List<BoundaryPointDto> boundaryPoints;
        private Integer capacity;
        private Integer maxCapacityCeiling;
    }

    @Data
    @Builder
    public static class BoundaryPointDto {
        private Integer pointOrder;
        private BigDecimal x;
        private BigDecimal y;
    }

    @Data
    @Builder
    public static class SeatRowDto {
        private UUID id;
        private UUID zoneId;
        private String code;
        private RowLayoutType layoutType;
        private BigDecimal x;
        private BigDecimal y;
        private BigDecimal rotationDegrees;
    }

    @Data
    @Builder
    public static class SeatDto {
        private UUID id;
        private UUID seatRowId;
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
        private String currentOccupantName;
        private UUID currentOccupantEmployeeId;
        private String currentOccupantAvatar;
        private List<String> amenities;
    }

    @Data
    @Builder
    public static class FloorObjectDto {
        private UUID id;
        private FloorObjectType objectType;
        private String name;
        private BigDecimal x;
        private BigDecimal y;
        private BigDecimal width;
        private BigDecimal height;
        private BigDecimal rotationDegrees;
        private String qrToken;
        private Integer capacity; // If meeting room
        private Integer maxCapacityCeiling;
    }
}
