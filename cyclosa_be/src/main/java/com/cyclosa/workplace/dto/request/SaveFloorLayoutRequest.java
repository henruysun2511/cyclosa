package com.cyclosa.workplace.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SaveFloorLayoutRequest {
    private Integer canvasWidth;
    private Integer canvasHeight;
    private BigDecimal scaleMetersPerPx;
    private String layoutJson;
    private List<LayoutObjectDto> objects;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LayoutObjectDto {
        private String id;
        private String name;
        private String type; // "ZONE", "SEAT", "MEETING_ROOM", "FACILITY"
        private BigDecimal x;
        private BigDecimal y;
        private BigDecimal w;
        private BigDecimal h;
        private BigDecimal rotation;
        private String seatType; // "HOT_DESK", "FIXED_DESK", "VIP"
        private String status; // "AVAILABLE", "OCCUPIED", "MAINTENANCE", "BLOCKED"
        private String zoneId;
        private String color;
        private Integer capacity;
        private Integer maxCapacityCeiling;
    }
}
