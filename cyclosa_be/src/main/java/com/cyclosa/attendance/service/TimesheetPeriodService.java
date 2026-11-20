package com.cyclosa.attendance.service;

import com.cyclosa.attendance.dto.request.CreateTimesheetPeriodRequest;
import com.cyclosa.attendance.dto.request.TimesheetPeriodFilter;
import com.cyclosa.attendance.dto.request.UnlockPeriodRequest;
import com.cyclosa.attendance.dto.response.*;
import com.cyclosa.attendance.entity.TimesheetPeriod;
import com.cyclosa.attendance.entity.TimesheetSnapshot;
import com.cyclosa.attendance.enums.TimesheetPeriodStatus;
import com.cyclosa.attendance.exception.AttendanceErrorCode;
import com.cyclosa.attendance.mapper.AttendanceMapper;
import com.cyclosa.attendance.repository.AttendanceRequestRepository;
import com.cyclosa.attendance.repository.TimesheetPeriodRepository;
import com.cyclosa.attendance.repository.TimesheetSnapshotRepository;
import com.cyclosa.audit.aop.Auditable;
import com.cyclosa.audit.enums.AuditAction;
import com.cyclosa.common.response.PageData;
import com.cyclosa.common.exception.AppException;
import com.cyclosa.common.util.SecurityUtils;
import com.cyclosa.common.util.PageableUtils;
import com.cyclosa.employee.entity.Employee;
import com.cyclosa.employee.service.EmployeeService;
import com.cyclosa.notification.enums.NotificationType;
import com.cyclosa.notification.event.SendNotificationEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class TimesheetPeriodService {

    private final TimesheetPeriodRepository timesheetPeriodRepository;
    private final TimesheetSnapshotRepository timesheetSnapshotRepository;
    private final AttendanceRequestRepository attendanceRequestRepository;
    private final AttendanceCalculationService attendanceCalculationService;
    private final EmployeeService employeeService;
    private final AttendanceMapper attendanceMapper;
    private final ApplicationEventPublisher eventPublisher;

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
            "year", "month", "status", "createdAt"
    );

    @Transactional(readOnly = true)
    public PageData<TimesheetPeriodResponse> getPeriods(TimesheetPeriodFilter filter) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        Pageable pageable = filter.toPageable("year", ALLOWED_SORT_FIELDS);

        Page<TimesheetPeriod> page = timesheetPeriodRepository.searchPeriods(companyId, filter.getYear(), filter.getStatus(), pageable);
        return PageData.of(page, attendanceMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public TimesheetPeriodResponse getPeriodById(UUID id) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        TimesheetPeriod period = timesheetPeriodRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new AppException(AttendanceErrorCode.TIMESHEET_PERIOD_NOT_FOUND));
        return attendanceMapper.toResponse(period);
    }

    @Auditable(action = AuditAction.CREATE, entityType = "TIMESHEET_PERIOD", entityIdExpression = "#result.id", description = "Mở kỳ chốt công mới")
    @Transactional
    public TimesheetPeriodResponse createPeriod(CreateTimesheetPeriodRequest req) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();

        if (timesheetPeriodRepository.existsByCompanyIdAndYearAndMonth(companyId, req.getYear(), req.getMonth())) {
            throw new AppException(AttendanceErrorCode.TIMESHEET_PERIOD_DUPLICATED);
        }

        TimesheetPeriod period = TimesheetPeriod.builder()
                .companyId(companyId)
                .year(req.getYear())
                .month(req.getMonth())
                .status(TimesheetPeriodStatus.OPEN)
                .build();

        TimesheetPeriod saved = timesheetPeriodRepository.save(period);
        log.info("Đã mở kỳ công tháng {}/{} cho công ty {}", req.getMonth(), req.getYear(), companyId);
        return attendanceMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public TimesheetPreLockCheckResponse preLockCheck(UUID periodId) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        TimesheetPeriod period = timesheetPeriodRepository.findByIdAndCompanyId(periodId, companyId)
                .orElseThrow(() -> new AppException(AttendanceErrorCode.TIMESHEET_PERIOD_NOT_FOUND));

        YearMonth ym = YearMonth.of(period.getYear(), period.getMonth());
        LocalDate startDate = ym.atDay(1);
        LocalDate endDate = ym.atEndOfMonth();

        long pendingRequests = attendanceRequestRepository.countPendingByCompanyAndDateRange(companyId, startDate, endDate);
        List<AttendanceExceptionSummaryResponse> exceptions = attendanceCalculationService.getExceptionSummaries(companyId, startDate, endDate);

        long missingPunch = exceptions.stream().filter(e -> "MISSING_PUNCH".equals(e.getExceptionType()) || "MISSING_CHECK_OUT".equals(e.getExceptionType())).count();
        long absentCount = exceptions.stream().filter(e -> "ABSENT".equals(e.getExceptionType())).count();

        List<String> warnings = new ArrayList<>();
        if (pendingRequests > 0) {
            warnings.add("Còn " + pendingRequests + " đơn giải trình chấm công đang chờ phê duyệt.");
        }
        if (missingPunch > 0) {
            warnings.add("Có " + missingPunch + " lượt thiếu quẹt thẻ chưa được giải trình bổ sung.");
        }
        if (absentCount > 0) {
            warnings.add("Có " + absentCount + " ngày vắng mặt không phép của nhân viên.");
        }

        boolean canLock = pendingRequests == 0;

        return TimesheetPreLockCheckResponse.builder()
                .canLock(canLock)
                .pendingRequestCount(pendingRequests)
                .missingPunchCount(missingPunch)
                .unexplainedAbsentCount(absentCount)
                .warnings(warnings)
                .build();
    }

    @Auditable(action = AuditAction.LOCK, entityType = "TIMESHEET_PERIOD", entityIdExpression = "#periodId", description = "Khóa kỳ công và chốt snapshot bảng công")
    @Transactional
    public TimesheetPeriodResponse lockPeriod(UUID periodId) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        UUID currentUserId = SecurityUtils.getCurrentUserId();

        TimesheetPeriod period = timesheetPeriodRepository.findByIdAndCompanyId(periodId, companyId)
                .orElseThrow(() -> new AppException(AttendanceErrorCode.TIMESHEET_PERIOD_NOT_FOUND));

        if (period.getStatus() == TimesheetPeriodStatus.LOCKED) {
            throw new AppException(AttendanceErrorCode.TIMESHEET_PERIOD_ALREADY_LOCKED);
        }

        TimesheetPreLockCheckResponse preCheck = preLockCheck(periodId);
        if (!preCheck.isCanLock()) {
            throw new AppException(AttendanceErrorCode.UNRESOLVED_EXCEPTIONS_REMAINING);
        }

        YearMonth ym = YearMonth.of(period.getYear(), period.getMonth());
        LocalDate startDate = ym.atDay(1);
        LocalDate endDate = ym.atEndOfMonth();

        // 1. Tạo snapshot cho toàn bộ nhân viên công ty
        List<Employee> employees = employeeService.findAllEntities().stream()
                .filter(e -> companyId.equals(e.getCompanyId()))
                .toList();

        List<TimesheetSnapshot> snapshots = new ArrayList<>();
        for (Employee emp : employees) {
            BigDecimal totalActualWork = BigDecimal.ZERO;
            int totalLateEarly = 0;
            int missingCount = 0;

            for (int day = 1; day <= ym.lengthOfMonth(); day++) {
                LocalDate curDate = ym.atDay(day);
                DailyAttendanceRecordResponse dayRec = attendanceCalculationService.computeDayRecord(emp, curDate);

                if (dayRec.getWorkCredit() != null) {
                    totalActualWork = totalActualWork.add(dayRec.getWorkCredit());
                }
                totalLateEarly += (dayRec.getLateMinutes() + dayRec.getEarlyMinutes());
                if (dayRec.getStatus() == com.cyclosa.attendance.enums.DailyAttendanceStatus.MISSING_CHECK_OUT) {
                    missingCount++;
                }
            }

            // Xóa snapshot cũ nếu có
            timesheetSnapshotRepository.findByTimesheetPeriodIdAndEmployeeId(periodId, emp.getId())
                    .ifPresent(timesheetSnapshotRepository::delete);

            TimesheetSnapshot snapshot = TimesheetSnapshot.builder()
                    .timesheetPeriod(period)
                    .employeeId(emp.getId())
                    .actualWorkDays(totalActualWork)
                    .paidLeaveDays(BigDecimal.ZERO)
                    .unpaidLeaveDays(BigDecimal.ZERO)
                    .socialInsuranceLeaveDays(BigDecimal.ZERO)
                    .lateEarlyMinutes(totalLateEarly)
                    .missingPunchCount(missingCount)
                    .build();

            snapshots.add(snapshot);
        }

        timesheetSnapshotRepository.saveAll(snapshots);

        // 2. Chuyển trạng thái sang LOCKED
        period.setStatus(TimesheetPeriodStatus.LOCKED);
        period.setLockedAt(Instant.now());
        period.setLockedByUserId(currentUserId);
        TimesheetPeriod saved = timesheetPeriodRepository.save(period);

        // Bắn thông báo chốt sổ kỳ công cho nhân viên
        List<UUID> targetUserIds = employees.stream()
                .map(Employee::getUserId)
                .filter(Objects::nonNull)
                .distinct()
                .toList();

        if (!targetUserIds.isEmpty()) {
            eventPublisher.publishEvent(new SendNotificationEvent(
                    targetUserIds,
                    NotificationType.ATTENDANCE,
                    "Bảng công tháng " + period.getMonth() + "/" + period.getYear() + " đã được chốt sổ",
                    "Kỳ công tháng " + period.getMonth() + "/" + period.getYear() + " đã hoàn tất chốt số liệu. Bạn có thể kiểm tra dữ liệu công cá nhân.",
                    "/me/timesheet-snapshots"
            ));
        }

        log.info("Đã khóa sổ kỳ công {}/{} thành công cho công ty {}", period.getMonth(), period.getYear(), companyId);
        return attendanceMapper.toResponse(saved);
    }

    @Auditable(action = AuditAction.UNLOCK, entityType = "TIMESHEET_PERIOD", entityIdExpression = "#periodId", description = "Mở khóa kỳ công đã chốt")
    @Transactional
    public TimesheetPeriodResponse unlockPeriod(UUID periodId, UnlockPeriodRequest req) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();

        TimesheetPeriod period = timesheetPeriodRepository.findByIdAndCompanyId(periodId, companyId)
                .orElseThrow(() -> new AppException(AttendanceErrorCode.TIMESHEET_PERIOD_NOT_FOUND));

        if (req == null || req.getReason() == null || req.getReason().trim().isBlank()) {
            throw new AppException(AttendanceErrorCode.UNLOCK_REASON_REQUIRED);
        }

        period.setStatus(TimesheetPeriodStatus.OPEN);
        period.setUnlockReason(req.getReason().trim());
        TimesheetPeriod saved = timesheetPeriodRepository.save(period);

        // Bắn thông báo mở khóa kỳ công
        List<UUID> targetUserIds = employeeService.findAllEntities().stream()
                .filter(e -> companyId.equals(e.getCompanyId()))
                .map(Employee::getUserId)
                .filter(Objects::nonNull)
                .distinct()
                .toList();

        if (!targetUserIds.isEmpty()) {
            eventPublisher.publishEvent(new SendNotificationEvent(
                    targetUserIds,
                    NotificationType.ATTENDANCE,
                    "Kỳ công tháng " + period.getMonth() + "/" + period.getYear() + " đã được mở khóa",
                    "Kỳ công tháng " + period.getMonth() + "/" + period.getYear() + " đã được mở khóa để hiệu chỉnh. Lý do: " + req.getReason().trim(),
                    "/me/timesheet-snapshots"
            ));
        }

        log.warn("Kỳ công {}/{} đã được mở khóa bởi user {}. Lý do: {}",
                period.getMonth(), period.getYear(), SecurityUtils.getCurrentUserId(), req.getReason());

        return attendanceMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public PageData<TimesheetSnapshotResponse> getSnapshots(UUID periodId, Pageable pageable) {
        Page<TimesheetSnapshot> page = timesheetSnapshotRepository.searchSnapshots(periodId, null, pageable);

        return PageData.of(page, snap -> {
            TimesheetSnapshotResponse res = attendanceMapper.toResponse(snap);
            employeeService.findEntityById(snap.getEmployeeId()).ifPresent(e -> {
                res.setEmployeeName(e.getLastName() + " " + e.getFirstName());
                res.setEmployeeCode(e.getEmployeeCode());
            });
            return res;
        });
    }

    @Transactional(readOnly = true)
    public List<TimesheetSnapshotResponse> getMySnapshots(Integer year) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        Employee employee = employeeService.findByUserId(currentUserId)
                .orElseThrow(() -> AppException.notFound("Không tìm thấy hồ sơ nhân viên"));

        List<TimesheetSnapshot> list = timesheetSnapshotRepository.findByEmployeeIdAndYear(employee.getId(), year);

        return list.stream().map(snap -> {
            TimesheetSnapshotResponse res = attendanceMapper.toResponse(snap);
            res.setEmployeeName(employee.getLastName() + " " + employee.getFirstName());
            res.setEmployeeCode(employee.getEmployeeCode());
            return res;
        }).toList();
    }
}

