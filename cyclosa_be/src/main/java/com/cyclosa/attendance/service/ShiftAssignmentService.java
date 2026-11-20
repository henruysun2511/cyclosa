package com.cyclosa.attendance.service;

import com.cyclosa.attendance.dto.request.BulkShiftAssignmentRequest;
import com.cyclosa.attendance.dto.request.ShiftAssignmentFilter;
import com.cyclosa.attendance.dto.response.ShiftAssignmentResponse;
import com.cyclosa.attendance.entity.Shift;
import com.cyclosa.attendance.entity.ShiftAssignment;
import com.cyclosa.attendance.exception.AttendanceErrorCode;
import com.cyclosa.attendance.mapper.AttendanceMapper;
import com.cyclosa.attendance.repository.ShiftAssignmentRepository;
import com.cyclosa.audit.aop.Auditable;
import com.cyclosa.audit.enums.AuditAction;
import com.cyclosa.common.response.PageData;
import com.cyclosa.common.exception.AppException;
import com.cyclosa.common.util.SecurityUtils;
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

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class ShiftAssignmentService {

    private final ShiftAssignmentRepository shiftAssignmentRepository;
    private final ShiftService shiftService;
    private final EmployeeService employeeService;
    private final AttendanceMapper attendanceMapper;
    private final ApplicationEventPublisher eventPublisher;

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
            "workDate", "createdAt"
    );

    @Transactional(readOnly = true)
    public PageData<ShiftAssignmentResponse> getAssignments(ShiftAssignmentFilter filter) {
        Pageable pageable = filter.toPageable("workDate", ALLOWED_SORT_FIELDS);

        Page<ShiftAssignment> page = shiftAssignmentRepository.searchAssignments(
                filter.getEmployeeId(),
                filter.getStartDate(),
                filter.getEndDate(),
                pageable
        );

        return PageData.of(page, sa -> {
            ShiftAssignmentResponse res = attendanceMapper.toResponse(sa);
            enrichEmployeeInfo(res, sa.getEmployeeId());
            return res;
        });
    }

    @Auditable(action = AuditAction.CREATE, entityType = "SHIFT_ASSIGNMENT", description = "Phân ca làm việc hàng loạt cho nhân viên")
    @Transactional
    public List<ShiftAssignmentResponse> bulkAssignShifts(BulkShiftAssignmentRequest req) {
        Shift shift = shiftService.getEntityById(req.getShiftId());

        if (req.getEndDate().isBefore(req.getStartDate())) {
            throw AppException.badRequest("Ngày kết thúc không được trước ngày bắt đầu");
        }

        List<ShiftAssignment> toSave = new ArrayList<>();

        for (UUID employeeId : req.getEmployeeIds()) {
            LocalDate current = req.getStartDate();
            while (!current.isAfter(req.getEndDate())) {
                boolean isWeekend = current.getDayOfWeek() == DayOfWeek.SATURDAY || current.getDayOfWeek() == DayOfWeek.SUNDAY;
                if (!Boolean.TRUE.equals(req.getExcludeWeekends()) || !isWeekend) {
                    Optional<ShiftAssignment> existingOpt = shiftAssignmentRepository.findByEmployeeIdAndWorkDate(employeeId, current);
                    ShiftAssignment sa;
                    if (existingOpt.isPresent()) {
                        sa = existingOpt.get();
                        sa.setShift(shift);
                    } else {
                        sa = ShiftAssignment.builder()
                                .employeeId(employeeId)
                                .workDate(current)
                                .shift(shift)
                                .build();
                    }
                    toSave.add(sa);
                }
                current = current.plusDays(1);
            }
        }

        List<ShiftAssignment> saved = shiftAssignmentRepository.saveAll(toSave);
        log.info("Đã phân ca hàng loạt: {} lượt phân ca cho ca {}", saved.size(), shift.getName());

        // Bắn thông báo phân ca cho từng nhân viên
        for (UUID employeeId : req.getEmployeeIds()) {
            employeeService.findEntityById(employeeId).ifPresent(emp -> {
                if (emp.getUserId() != null) {
                    eventPublisher.publishEvent(SendNotificationEvent.ofSingle(
                            emp.getUserId(),
                            NotificationType.ATTENDANCE,
                            "Lịch phân ca làm việc mới",
                            "Bạn được phân ca " + shift.getName() + " từ ngày " + req.getStartDate() + " đến ngày " + req.getEndDate() + ".",
                            "/me/shifts"
                    ));
                }
            });
        }

        return saved.stream().map(sa -> {
            ShiftAssignmentResponse res = attendanceMapper.toResponse(sa);
            enrichEmployeeInfo(res, sa.getEmployeeId());
            return res;
        }).toList();
    }

    @Auditable(action = AuditAction.UPDATE, entityType = "SHIFT_ASSIGNMENT", entityIdExpression = "#id", description = "Hiệu chỉnh ca làm việc của nhân viên")
    @Transactional
    public ShiftAssignmentResponse updateShiftAssignment(UUID id, UUID newShiftId) {
        ShiftAssignment sa = shiftAssignmentRepository.findById(id)
                .orElseThrow(() -> AppException.notFound("Không tìm thấy bản ghi phân ca"));

        Shift newShift = shiftService.getEntityById(newShiftId);
        sa.setShift(newShift);
        ShiftAssignment updated = shiftAssignmentRepository.save(sa);

        employeeService.findEntityById(updated.getEmployeeId()).ifPresent(emp -> {
            if (emp.getUserId() != null) {
                eventPublisher.publishEvent(SendNotificationEvent.ofSingle(
                        emp.getUserId(),
                        NotificationType.ATTENDANCE,
                        "Cập nhật ca làm việc",
                        "Ca làm việc ngày " + updated.getWorkDate() + " của bạn đã được đổi sang: " + newShift.getName() + ".",
                        "/me/shifts"
                ));
            }
        });

        ShiftAssignmentResponse res = attendanceMapper.toResponse(updated);
        enrichEmployeeInfo(res, updated.getEmployeeId());
        return res;
    }

    @Auditable(action = AuditAction.DELETE, entityType = "SHIFT_ASSIGNMENT", entityIdExpression = "#id", description = "Hủy phân ca làm việc của nhân viên")
    @Transactional
    public void deleteShiftAssignment(UUID id) {
        ShiftAssignment sa = shiftAssignmentRepository.findById(id)
                .orElseThrow(() -> AppException.notFound("Không tìm thấy bản ghi phân ca"));
        shiftAssignmentRepository.delete(sa);
        log.info("Đã xóa phân ca ngày {} của nhân viên {}", sa.getWorkDate(), sa.getEmployeeId());
    }

    @Transactional(readOnly = true)
    public List<ShiftAssignmentResponse> getMyShifts(LocalDate from, LocalDate to) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        Employee employee = employeeService.findByUserId(currentUserId)
                .orElseThrow(() -> AppException.notFound("Không tìm thấy hồ sơ nhân viên của bạn"));

        LocalDate startDate = from != null ? from : LocalDate.now().withDayOfMonth(1);
        LocalDate endDate = to != null ? to : startDate.plusMonths(1).minusDays(1);

        List<ShiftAssignment> list = shiftAssignmentRepository.findByEmployeeIdAndDateRange(employee.getId(), startDate, endDate);
        return list.stream().map(sa -> {
            ShiftAssignmentResponse res = attendanceMapper.toResponse(sa);
            enrichEmployeeInfo(res, employee.getId());
            return res;
        }).toList();
    }

    private void enrichEmployeeInfo(ShiftAssignmentResponse res, UUID employeeId) {
        try {
            employeeService.findEntityById(employeeId).ifPresent(e -> {
                res.setEmployeeName(e.getLastName() + " " + e.getFirstName());
                res.setEmployeeCode(e.getEmployeeCode());
            });
        } catch (Exception ignored) {
        }
    }
}

