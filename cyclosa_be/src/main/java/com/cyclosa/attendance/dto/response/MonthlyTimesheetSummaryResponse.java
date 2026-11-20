package com.cyclosa.attendance.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Ma trận bảng công tháng thời gian thực (chưa khóa)")
public class MonthlyTimesheetSummaryResponse {

    private Integer year;
    private Integer month;
    private List<EmployeeMonthRow> rows;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class EmployeeMonthRow {
        private UUID employeeId;
        private String employeeName;
        private String employeeCode;
        private String departmentName;
        private Map<Integer, String> dayStatusMap; // Ngày trong tháng -> Ký hiệu ("1.0", "0.5", "P", "V", "M")
        private BigDecimal totalWorkDays;
        private BigDecimal totalPaidLeaveDays;
        private BigDecimal totalUnpaidLeaveDays;
        private Integer totalLateEarlyMinutes;
        private Integer missingPunchCount;
    }
}

