package com.cyclosa.attendance.dto.response;

import com.cyclosa.attendance.enums.AttendanceRequestStatus;
import com.cyclosa.attendance.enums.AttendanceRequestType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Thông tin chi tiết đơn giải trình chấm công")
public class AttendanceRequestResponse {

    private UUID id;
    private UUID companyId;
    private UUID employeeId;
    private String employeeName;
    private String employeeCode;
    private String departmentName;
    private LocalDate workDate;
    private AttendanceRequestType requestType;
    private Instant proposedCheckIn;
    private Instant proposedCheckOut;
    private String reason;
    private UUID attachmentFileId;
    private Instant submittedAt;
    private AttendanceRequestStatus status;
    private UUID reviewedByUserId;
    private String reviewerName;
    private Instant reviewedAt;
    private String rejectionReason;
    private boolean isAdjusted;
    private Instant adjustedCheckIn;
    private Instant adjustedCheckOut;
}

