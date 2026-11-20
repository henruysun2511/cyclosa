package com.cyclosa.workplace.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class EmployeeLocationResponse {
    private UUID employeeId;
    private String employeeName;
    private String employeeCode;
    private String departmentName;
    private String avatarUrl;
    private UUID siteId;
    private String siteName;
    private UUID floorId;
    private String floorName;
    private Integer floorNumber;
    private UUID seatId;
    private String seatCode;
    private BigDecimal x;
    private BigDecimal y;
    private String seatType; // DEDICATED or HOT_DESK
}
