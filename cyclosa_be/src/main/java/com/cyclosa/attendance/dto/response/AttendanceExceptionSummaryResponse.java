package com.cyclosa.attendance.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Ngoại lệ chấm công cần xử lý gấp")
public class AttendanceExceptionSummaryResponse {

    private UUID employeeId;
    private String employeeName;
    private String employeeCode;
    private String departmentName;
    private LocalDate workDate;
    private String exceptionType; // "MISSING_PUNCH", "UNEXPLAINED_ABSENT", "AUTH_FAILED"
    private String details;
    private boolean hasPendingRequest;
    private UUID pendingRequestId;
}

