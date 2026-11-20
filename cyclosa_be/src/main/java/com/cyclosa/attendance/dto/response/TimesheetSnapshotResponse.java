package com.cyclosa.attendance.dto.response;

import com.cyclosa.attendance.enums.OvertimeDayType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Bản chụp bảng công tháng đã chốt của nhân viên")
public class TimesheetSnapshotResponse {

    private UUID id;
    private UUID timesheetPeriodId;
    private Integer year;
    private Integer month;
    private UUID employeeId;
    private String employeeName;
    private String employeeCode;
    private String departmentName;
    private BigDecimal actualWorkDays;
    private BigDecimal paidLeaveDays;
    private BigDecimal unpaidLeaveDays;
    private BigDecimal socialInsuranceLeaveDays;
    private Integer lateEarlyMinutes;
    private Integer missingPunchCount;
    private List<OvertimeSummaryDto> overtimeDetails;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OvertimeSummaryDto {
        private OvertimeDayType overtimeDayType;
        private Boolean isNightWork;
        private BigDecimal hours;
    }
}

