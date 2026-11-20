package com.cyclosa.attendance.service;

import com.cyclosa.attendance.dto.request.DailyRecordFilter;
import com.cyclosa.attendance.dto.request.MonthlySummaryFilter;
import com.cyclosa.attendance.dto.response.AttendanceExceptionSummaryResponse;
import com.cyclosa.attendance.dto.response.DailyAttendanceRecordResponse;
import com.cyclosa.attendance.dto.response.MonthlyTimesheetSummaryResponse;
import com.cyclosa.attendance.entity.*;
import com.cyclosa.attendance.enums.AttendanceEventType;
import com.cyclosa.attendance.enums.DailyAttendanceStatus;
import com.cyclosa.attendance.enums.VerificationResult;
import com.cyclosa.attendance.repository.*;
import com.cyclosa.common.response.PageData;
import com.cyclosa.common.exception.AppException;
import com.cyclosa.common.util.SecurityUtils;
import com.cyclosa.employee.entity.Employee;
import com.cyclosa.employee.service.EmployeeService;
import com.cyclosa.attendance.service.helper.TimesheetCalculationHelper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AttendanceCalculationService {

    private final AttendanceLogRepository attendanceLogRepository;
    private final ShiftAssignmentRepository shiftAssignmentRepository;
    private final AttendanceRequestRepository attendanceRequestRepository;
    private final AttendanceAdjustmentRepository attendanceAdjustmentRepository;
    private final EmployeeService employeeService;

    private static final ZoneId VIETNAM_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");

    @Transactional(readOnly = true)
    public PageData<DailyAttendanceRecordResponse> calculateDailyRecords(DailyRecordFilter filter) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        LocalDate targetDate = filter.getWorkDate() != null ? filter.getWorkDate() : LocalDate.now(VIETNAM_ZONE);

        List<Employee> employees;
        if (filter.getEmployeeId() != null) {
            employees = employeeService.findEntityById(filter.getEmployeeId()).map(List::of).orElse(Collections.emptyList());
        } else {
            employees = employeeService.findAllEntities().stream()
                    .filter(e -> companyId.equals(e.getCompanyId()))
                    .collect(Collectors.toList());
        }

        List<DailyAttendanceRecordResponse> records = new ArrayList<>();
        for (Employee emp : employees) {
            DailyAttendanceRecordResponse record = computeDayRecord(emp, targetDate);
            if (filter.getStatus() == null || filter.getStatus() == record.getStatus()) {
                records.add(record);
            }
        }

        int page = filter.getPage();
        int size = filter.getSize() > 0 ? filter.getSize() : 10;
        int start = Math.min(page * size, records.size());
        int end = Math.min((page + 1) * size, records.size());

        List<DailyAttendanceRecordResponse> subList = records.subList(start, end);

        return PageData.<DailyAttendanceRecordResponse>builder()
                .items(subList)
                .pagination(PageData.Pagination.builder()
                        .page(page)
                        .size(size)
                        .total(records.size())
                        .pages((int) Math.ceil((double) records.size() / size))
                        .hasNext(end < records.size())
                        .hasPrev(page > 0)
                        .build())
                .build();
    }

    @Transactional(readOnly = true)
    public PageData<DailyAttendanceRecordResponse> getMyDailyRecords(DailyRecordFilter filter) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        Employee employee = employeeService.findByUserId(currentUserId)
                .orElseThrow(() -> AppException.notFound("Không tìm thấy hồ sơ nhân viên"));

        filter.setEmployeeId(employee.getId());
        return calculateDailyRecords(filter);
    }

    @Transactional(readOnly = true)
    public MonthlyTimesheetSummaryResponse calculateMonthlySummary(MonthlySummaryFilter filter) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        int year = filter.getYear();
        int month = filter.getMonth();

        YearMonth ym = YearMonth.of(year, month);
        LocalDate startDate = ym.atDay(1);
        LocalDate endDate = ym.atEndOfMonth();

        List<Employee> employees = employeeService.findAllEntities().stream()
                .filter(e -> companyId.equals(e.getCompanyId()))
                .filter(e -> filter.getEmployeeId() == null || filter.getEmployeeId().equals(e.getId()))
                .toList();

        List<MonthlyTimesheetSummaryResponse.EmployeeMonthRow> rows = new ArrayList<>();

        for (Employee emp : employees) {
            Map<Integer, String> dayMap = new HashMap<>();
            BigDecimal totalWork = BigDecimal.ZERO;
            BigDecimal totalPaidLeave = BigDecimal.ZERO;
            BigDecimal totalUnpaidLeave = BigDecimal.ZERO;
            int totalLateEarly = 0;
            int missingPunch = 0;

            for (int day = 1; day <= ym.lengthOfMonth(); day++) {
                LocalDate date = ym.atDay(day);
                DailyAttendanceRecordResponse dayRec = computeDayRecord(emp, date);

                String symbol = "0.0";
                switch (dayRec.getStatus()) {
                    case ON_TIME, EXPLAINED -> {
                        symbol = String.format("%.1f", dayRec.getWorkCredit());
                        totalWork = totalWork.add(dayRec.getWorkCredit());
                    }
                    case LATE, EARLY, LATE_AND_EARLY -> {
                        symbol = String.format("%.1f", dayRec.getWorkCredit());
                        totalWork = totalWork.add(dayRec.getWorkCredit());
                        totalLateEarly += (dayRec.getLateMinutes() + dayRec.getEarlyMinutes());
                    }
                    case MISSING_CHECK_OUT -> {
                        symbol = "M";
                        missingPunch++;
                    }
                    case ABSENT -> {
                        symbol = "V";
                        totalUnpaidLeave = totalUnpaidLeave.add(BigDecimal.ONE);
                    }
                    case PAID_LEAVE -> {
                        symbol = "P";
                        totalPaidLeave = totalPaidLeave.add(BigDecimal.ONE);
                    }
                    case UNPAID_LEAVE -> {
                        symbol = "KL";
                        totalUnpaidLeave = totalUnpaidLeave.add(BigDecimal.ONE);
                    }
                    case REST_DAY -> symbol = "OFF";
                    case HOLIDAY -> symbol = "L";
                }
                dayMap.put(day, symbol);
            }

            rows.add(MonthlyTimesheetSummaryResponse.EmployeeMonthRow.builder()
                    .employeeId(emp.getId())
                    .employeeName(emp.getLastName() + " " + emp.getFirstName())
                    .employeeCode(emp.getEmployeeCode())
                    .dayStatusMap(dayMap)
                    .totalWorkDays(totalWork)
                    .totalPaidLeaveDays(totalPaidLeave)
                    .totalUnpaidLeaveDays(totalUnpaidLeave)
                    .totalLateEarlyMinutes(totalLateEarly)
                    .missingPunchCount(missingPunch)
                    .build());
        }

        return MonthlyTimesheetSummaryResponse.builder()
                .year(year)
                .month(month)
                .rows(rows)
                .build();
    }

    @Transactional(readOnly = true)
    public List<AttendanceExceptionSummaryResponse> getExceptionSummaries(UUID companyId, LocalDate startDate, LocalDate endDate) {
        List<Employee> employees = employeeService.findAllEntities().stream()
                .filter(e -> companyId.equals(e.getCompanyId()))
                .toList();

        List<AttendanceExceptionSummaryResponse> exceptions = new ArrayList<>();
        LocalDate cur = startDate;

        while (!cur.isAfter(endDate)) {
            for (Employee emp : employees) {
                DailyAttendanceRecordResponse dayRec = computeDayRecord(emp, cur);
                if (dayRec.getStatus() == DailyAttendanceStatus.MISSING_CHECK_OUT ||
                    dayRec.getStatus() == DailyAttendanceStatus.ABSENT) {

                    exceptions.add(AttendanceExceptionSummaryResponse.builder()
                            .employeeId(emp.getId())
                            .employeeName(emp.getLastName() + " " + emp.getFirstName())
                            .employeeCode(emp.getEmployeeCode())
                            .workDate(cur)
                            .exceptionType(dayRec.getStatus().name())
                            .details(dayRec.getStatus() == DailyAttendanceStatus.MISSING_CHECK_OUT
                                    ? "Thiếu lượt chấm công ra (Check-out)"
                                    : "Vắng mặt không có lượt quẹt thẻ")
                            .hasPendingRequest(false)
                            .build());
                }
            }
            cur = cur.plusDays(1);
        }

        return exceptions;
    }

    /**
     * Thuật toán tính toán ngày công dựa trên: Ca làm việc, Log quẹt thẻ, Đơn giải trình
     */
    public DailyAttendanceRecordResponse computeDayRecord(Employee emp, LocalDate date) {
        Instant dayStart = date.atStartOfDay(VIETNAM_ZONE).toInstant();
        Instant dayEnd = date.plusDays(1).atStartOfDay(VIETNAM_ZONE).toInstant();

        Optional<ShiftAssignment> saOpt = shiftAssignmentRepository.findByEmployeeIdAndWorkDate(emp.getId(), date);
        Shift shift = saOpt.map(ShiftAssignment::getShift).orElse(null);

        List<AttendanceRequest> approvedRequests = attendanceRequestRepository.findApprovedByEmployeeAndDateRange(emp.getId(), date, date);
        Optional<AttendanceAdjustment> adjOpt = approvedRequests.isEmpty() ? Optional.empty()
                : attendanceAdjustmentRepository.findByAttendanceRequestId(approvedRequests.get(0).getId());

        List<AttendanceLog> logs = attendanceLogRepository.findByEmployeeIdAndOccurredAtBetween(emp.getId(), dayStart, dayEnd);

        return TimesheetCalculationHelper.calculateDayRecord(emp, date, shift, approvedRequests, adjOpt, logs);
    }
}

