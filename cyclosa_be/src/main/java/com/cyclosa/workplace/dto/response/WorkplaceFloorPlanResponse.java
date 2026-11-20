package com.cyclosa.workplace.dto.response;

import com.cyclosa.workplace.enums.FloorPlanStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class WorkplaceFloorPlanResponse {
    private UUID id;
    private UUID floorId;
    private Integer versionNo;
    private String backgroundFileUrl;
    private Integer canvasWidth;
    private Integer canvasHeight;
    private BigDecimal scaleMetersPerPx;
    private FloorPlanStatus status;
    private String layoutData;
    private LocalDateTime createdAt;
}
