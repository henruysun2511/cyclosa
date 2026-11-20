package com.cyclosa.workplace.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class WorkplaceFloorResponse {
    private UUID id;
    private UUID siteId;
    private String siteName;
    private Integer floorNumber;
    private String name;
    private String description;
    private Integer zoneCount;
    private Integer seatCount;
    private String publishedPlanVersion;
    private LocalDateTime createdAt;
}
