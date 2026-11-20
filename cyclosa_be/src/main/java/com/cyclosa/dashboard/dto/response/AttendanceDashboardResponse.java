package com.cyclosa.dashboard.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceDashboardResponse {

    // ── 4 KPIs ──
    private Double onTimeRateToday;
    private Long lateEarlyCountMonth;
    private Double totalOvertimeHours;
    private Long pendingLeaveRequests;

    // ── BIỂU ĐỒ ──
    private List<DailyTrendPoint> dailyLateTrend;
    private List<DepartmentOvertimePoint> topOvertimeDepartments;
    private List<LeaveTypeSharePoint> leaveTypeDistribution;
    private List<ShiftAttendanceSummary> shiftAttendanceSummary;

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailyTrendPoint {
        private String dayOfWeek; // Thứ 2, Thứ 3...
        private Long onTimeCount;
        private Long lateCount;
        private Long absentCount;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DepartmentOvertimePoint {
        private String departmentName;
        private Double totalOvertimeHours;
        private Double averageHoursPerEmployee;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LeaveTypeSharePoint {
        private String leaveType;
        private String label;
        private Double daysCount;
        private Double percentage;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ShiftAttendanceSummary {
        private String shiftName;
        private Long totalScheduled;
        private Long presentCount;
        private Long lateCount;
        private Long absentCount;
    }
}
