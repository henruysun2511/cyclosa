package com.cyclosa.workplace.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkplaceAmenityResponse {
    private UUID id;
    private String name;
    private String iconName;
    private String description;
    private int seatCount;
    private LocalDateTime createdAt;
}
