package com.cyclosa.attendance.service;

import com.cyclosa.attendance.dto.request.AttendanceLogFilter;
import com.cyclosa.attendance.dto.request.DailyRecordFilter;
import com.cyclosa.attendance.dto.request.MonthlySummaryFilter;
import com.cyclosa.attendance.dto.request.PunchRequest;
import com.cyclosa.attendance.dto.response.*;
import com.cyclosa.attendance.enums.AttendanceEventType;
import com.cyclosa.common.response.PageData;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

/**
 * Service tổng hợp nghiệp vụ chấm công (Check-in, Check-out, Lịch sử quẹt thẻ & Tính toán công nhật)
 */
@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendancePunchService punchService;
    private final AttendanceCalculationService calculationService;

    public AttendanceLogResponse punch(AttendanceEventType eventType, PunchRequest req) {
        return punchService.punch(eventType, req);
    }

    public TodayAttendanceStatusResponse getMyTodayStatus() {
        return punchService.getMyTodayStatus();
    }

    public TodayAttendanceStatusResponse getTodayStatus(UUID employeeId) {
        return punchService.getTodayStatus(employeeId);
    }

    public PageData<AttendanceLogResponse> getMyLogs(AttendanceLogFilter filter) {
        return punchService.getMyLogs(filter);
    }

    public PageData<AttendanceLogResponse> getAllLogs(AttendanceLogFilter filter) {
        return punchService.getLogs(filter);
    }

    public PageData<DailyAttendanceRecordResponse> calculateDailyRecords(DailyRecordFilter filter) {
        return calculationService.calculateDailyRecords(filter);
    }

    public PageData<DailyAttendanceRecordResponse> getMyDailyRecords(DailyRecordFilter filter) {
        return calculationService.getMyDailyRecords(filter);
    }

    public MonthlyTimesheetSummaryResponse calculateMonthlySummary(MonthlySummaryFilter filter) {
        return calculationService.calculateMonthlySummary(filter);
    }
}
