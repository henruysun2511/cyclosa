package com.cyclosa.workplace.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class QrResolutionResponse {
    private String targetType; // SEAT, ROOM, WAYPOINT
    private UUID targetId;
    private String code;
    private String name;
    private UUID floorId;
    private String floorName;
}
