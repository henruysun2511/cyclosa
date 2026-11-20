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
@Schema(description = "Trạng thái chấm công ngày hôm nay của nhân viên")
public class TodayAttendanceStatusResponse {

    private UUID employeeId;
    private String employeeName;
    private LocalDate todayDate;
    private String shiftName;
    private String shiftHours;
    private Instant firstCheckInTime;
    private Instant lastCheckOutTime;
    private DailyAttendanceStatus status;
    private Integer lateMinutes;
    private Integer earlyMinutes;
    private BigDecimal workCredit;
    private boolean canCheckIn;
    private boolean canCheckOut;
}

