package com.cyclosa.attendance.dto.response;

import com.cyclosa.attendance.enums.DailyAttendanceStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Kết quả ngày công (Derived State)")
public class DailyAttendanceRecordResponse {

    private UUID employeeId;
    private String employeeName;
    private String employeeCode;
    private String departmentName;
    private LocalDate workDate;
    private String shiftName;
    private String shiftHours;
    private Instant checkInTime;
    private Instant checkOutTime;
    private DailyAttendanceStatus status;
    private Integer lateMinutes;
    private Integer earlyMinutes;
    private BigDecimal workCredit;
    private boolean isAdjusted;
    private String adjustmentReason;
    private String leaveTypeName;
}

