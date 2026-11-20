package com.cyclosa.workplace.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class NavigationRouteResponse {
    private UUID floorId;
    private BigDecimal totalDistanceMeters;
    private List<PointDto> pathPoints;

    @Data
    @Builder
    public static class PointDto {
        private BigDecimal x;
        private BigDecimal y;
    }
}
