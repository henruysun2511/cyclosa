package com.cyclosa.attendance.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Bản ghi truy vết điều chỉnh công sau phê duyệt")
public class AttendanceAdjustmentResponse {

    private UUID id;
    private UUID companyId;
    private UUID employeeId;
    private String employeeName;
    private String employeeCode;
    private String departmentName;
    private UUID attendanceRequestId;
    private LocalDate workDate;
    private Instant adjustedCheckIn;
    private Instant adjustedCheckOut;
    private String notes;
    private LocalDateTime createdAt;
}

