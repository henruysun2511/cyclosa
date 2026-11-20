package com.cyclosa.workplace.dto.response;

import com.cyclosa.workplace.enums.IssueSeverity;
import com.cyclosa.workplace.enums.WorkplaceIssueStatus;
import com.cyclosa.workplace.enums.WorkplaceIssueType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class WorkplaceIssueResponse {
    private UUID id;
    private UUID reporterEmployeeId;
    private String reporterName;
    private WorkplaceIssueType issueType;
    private IssueSeverity severity;
    private String title;
    private String description;
    private UUID seatId;
    private String seatCode;
    private UUID floorObjectId;
    private String floorObjectName;
    private UUID floorId;
    private String floorName;
    private String siteName;
    private BigDecimal locationX;
    private BigDecimal locationY;
    private WorkplaceIssueStatus status;
    private UUID assignedToEmployeeId;
    private String assignedToName;
    private String resolutionNote;
    private LocalDateTime reportedAt;
    private LocalDateTime resolvedAt;
}
