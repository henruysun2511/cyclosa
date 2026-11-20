package com.cyclosa.attendance.dto.response;

import com.cyclosa.attendance.enums.TimesheetPeriodStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Thông tin kỳ công tháng")
public class TimesheetPeriodResponse {

    private UUID id;
    private UUID companyId;
    private Integer year;
    private Integer month;
    private TimesheetPeriodStatus status;
    private Instant lockedAt;
    private UUID lockedByUserId;
    private String lockedByUserName;
    private String unlockReason;
    private LocalDateTime createdAt;
}

