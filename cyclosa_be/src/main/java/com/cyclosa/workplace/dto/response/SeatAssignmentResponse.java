package com.cyclosa.workplace.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class SeatAssignmentResponse {
    private UUID id;
    private UUID seatId;
    private String seatCode;
    private String floorName;
    private String siteName;
    private UUID employeeId;
    private String employeeName;
    private String employeeCode;
    private String departmentName;
    private String avatarUrl;
    private LocalDateTime assignedAt;
    private LocalDateTime releasedAt;
    private String note;
}
