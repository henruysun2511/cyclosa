package com.cyclosa.workplace.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class WorkplaceSiteResponse {
    private UUID id;
    private UUID branchId;
    private String branchName;
    private String code;
    private String name;
    private String address;
    private String description;
    private Integer floorCount;
    private LocalDateTime createdAt;
}
