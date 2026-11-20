package com.cyclosa.attendance;

import com.cyclosa.attendance.dto.response.DailyAttendanceRecordResponse;
import com.cyclosa.attendance.entity.*;
import com.cyclosa.attendance.enums.AttendanceEventType;
import com.cyclosa.attendance.enums.DailyAttendanceStatus;
import com.cyclosa.attendance.enums.VerificationResult;
import com.cyclosa.attendance.repository.*;
import com.cyclosa.attendance.service.AttendanceCalculationService;
import com.cyclosa.employee.entity.Employee;
import com.cyclosa.employee.service.EmployeeService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Proxy;
import java.math.BigDecimal;
import java.time.*;
import java.util.*;
import java.util.function.Function;

import static org.assertj.core.api.Assertions.assertThat;

class AttendanceCalculationServiceTest {

    private final UUID empId = UUID.randomUUID();
    private final Employee employee = Employee.builder()
            .employeeCode("EMP001")
            .lastName("Nguyễn")
            .firstName("Văn A")
            .build();

    private final Shift standardShift = Shift.builder()
            .code("HC")
            .name("Hành chính")
            .startTime(LocalTime.of(8, 0))
            .endTime(LocalTime.of(17, 0))
            .lateGraceMinutes(15)
            .earlyGraceMinutes(0)
            .workCredit(BigDecimal.ONE)
            .build();

    @SuppressWarnings("unchecked")
    private <T> T createStub(Class<T> type, Map<String, Object> methods) {
        return (T) Proxy.newProxyInstance(type.getClassLoader(), new Class<?>[]{type}, (proxy, method, args) -> {
            if ("equals".equals(method.getName())) return proxy == args[0];
            if ("hashCode".equals(method.getName())) return System.identityHashCode(proxy);
            if ("toString".equals(method.getName())) return type.getSimpleName() + "Stub";
            if (methods != null && methods.containsKey(method.getName())) {
                Object val = methods.get(method.getName());
                if (val instanceof Function) {
                    return ((Function<Object[], Object>) val).apply(args);
                }
                return val;
            }
            if (method.getReturnType().equals(Optional.class)) return Optional.empty();
            if (method.getReturnType().equals(List.class)) return Collections.emptyList();
            if (method.getReturnType().equals(boolean.class)) return false;
            return null;
        });
    }

    @Test
    @DisplayName("Chấm công đúng giờ: đủ check-in và check-out trong dung sai ca")
    void computeDayRecord_OnTime() {
        LocalDate workDate = LocalDate.of(2026, 11, 16); // Thứ Hai

        ShiftAssignment sa = ShiftAssignment.builder()
                .employeeId(empId)
                .workDate(workDate)
                .shift(standardShift)
                .build();

        ZoneId zone = ZoneId.of("Asia/Ho_Chi_Minh");
        Instant checkIn = workDate.atTime(8, 5).atZone(zone).toInstant();
        Instant checkOut = workDate.atTime(17, 2).atZone(zone).toInstant();

        AttendanceLog inLog = AttendanceLog.builder()
                .eventType(AttendanceEventType.CHECK_IN)
                .verificationResult(VerificationResult.SUCCESS)
                .occurredAt(checkIn)
                .build();

        AttendanceLog outLog = AttendanceLog.builder()
                .eventType(AttendanceEventType.CHECK_OUT)
                .verificationResult(VerificationResult.SUCCESS)
                .occurredAt(checkOut)
                .build();

        ShiftAssignmentRepository saRepo = createStub(ShiftAssignmentRepository.class, Map.of(
                "findByEmployeeIdAndWorkDate", Optional.of(sa)
        ));
        AttendanceRequestRepository reqRepo = createStub(AttendanceRequestRepository.class, Map.of(
                "findApprovedByEmployeeAndDateRange", Collections.emptyList()
        ));
        AttendanceLogRepository logRepo = createStub(AttendanceLogRepository.class, Map.of(
                "findByEmployeeIdAndOccurredAtBetween", List.of(inLog, outLog)
        ));
        AttendanceAdjustmentRepository adjRepo = createStub(AttendanceAdjustmentRepository.class, Collections.emptyMap());
        AttendanceCalculationService service = new AttendanceCalculationService(
                logRepo, saRepo, reqRepo, adjRepo, null
        );

        DailyAttendanceRecordResponse res = service.computeDayRecord(employee, workDate);

        assertThat(res.getStatus()).isEqualTo(DailyAttendanceStatus.ON_TIME);
        assertThat(res.getLateMinutes()).isEqualTo(0);
        assertThat(res.getEarlyMinutes()).isEqualTo(0);
        assertThat(res.getWorkCredit()).isEqualTo(BigDecimal.ONE);
    }

    @Test
    @DisplayName("Đi muộn: giờ check-in vượt quá số phút ân hạn của ca")
    void computeDayRecord_Late() {
        LocalDate workDate = LocalDate.of(2026, 11, 16); // Thứ Hai

        ShiftAssignment sa = ShiftAssignment.builder()
                .employeeId(empId)
                .workDate(workDate)
                .shift(standardShift)
                .build();

        ZoneId zone = ZoneId.of("Asia/Ho_Chi_Minh");
        Instant checkIn = workDate.atTime(8, 30).atZone(zone).toInstant();  // Đi muộn 30 phút (> 15p ân hạn)
        Instant checkOut = workDate.atTime(17, 0).atZone(zone).toInstant();

        AttendanceLog inLog = AttendanceLog.builder()
                .eventType(AttendanceEventType.CHECK_IN)
                .verificationResult(VerificationResult.SUCCESS)
                .occurredAt(checkIn)
                .build();

        AttendanceLog outLog = AttendanceLog.builder()
                .eventType(AttendanceEventType.CHECK_OUT)
                .verificationResult(VerificationResult.SUCCESS)
                .occurredAt(checkOut)
                .build();

        ShiftAssignmentRepository saRepo = createStub(ShiftAssignmentRepository.class, Map.of(
                "findByEmployeeIdAndWorkDate", Optional.of(sa)
        ));
        AttendanceRequestRepository reqRepo = createStub(AttendanceRequestRepository.class, Map.of(
                "findApprovedByEmployeeAndDateRange", Collections.emptyList()
        ));
        AttendanceLogRepository logRepo = createStub(AttendanceLogRepository.class, Map.of(
                "findByEmployeeIdAndOccurredAtBetween", List.of(inLog, outLog)
        ));
        AttendanceAdjustmentRepository adjRepo = createStub(AttendanceAdjustmentRepository.class, Collections.emptyMap());
        AttendanceCalculationService service = new AttendanceCalculationService(
                logRepo, saRepo, reqRepo, adjRepo, null
        );

        DailyAttendanceRecordResponse res = service.computeDayRecord(employee, workDate);

        assertThat(res.getStatus()).isEqualTo(DailyAttendanceStatus.LATE);
        assertThat(res.getLateMinutes()).isEqualTo(30);
    }

    @Test
    @DisplayName("Vắng mặt: không có bất kỳ lượt quẹt thẻ nào và không có đơn giải trình")
    void computeDayRecord_Absent() {
        LocalDate workDate = LocalDate.of(2026, 11, 16);

        ShiftAssignment sa = ShiftAssignment.builder()
                .employeeId(empId)
                .workDate(workDate)
                .shift(standardShift)
                .build();

        ShiftAssignmentRepository saRepo = createStub(ShiftAssignmentRepository.class, Map.of(
                "findByEmployeeIdAndWorkDate", Optional.of(sa)
        ));
        AttendanceRequestRepository reqRepo = createStub(AttendanceRequestRepository.class, Map.of(
                "findApprovedByEmployeeAndDateRange", Collections.emptyList()
        ));
        AttendanceLogRepository logRepo = createStub(AttendanceLogRepository.class, Map.of(
                "findByEmployeeIdAndOccurredAtBetween", Collections.emptyList()
        ));
        AttendanceAdjustmentRepository adjRepo = createStub(AttendanceAdjustmentRepository.class, Collections.emptyMap());
        AttendanceCalculationService service = new AttendanceCalculationService(
                logRepo, saRepo, reqRepo, adjRepo, null
        );

        DailyAttendanceRecordResponse res = service.computeDayRecord(employee, workDate);

        assertThat(res.getStatus()).isEqualTo(DailyAttendanceStatus.ABSENT);
        assertThat(res.getWorkCredit()).isEqualTo(BigDecimal.ZERO);
    }

    @Test
    @DisplayName("Thiếu check-out: chỉ có lượt quẹt thẻ vào ca (Check-in)")
    void computeDayRecord_MissingCheckOut() {
        LocalDate workDate = LocalDate.of(2026, 11, 16);

        ShiftAssignment sa = ShiftAssignment.builder()
                .employeeId(empId)
                .workDate(workDate)
                .shift(standardShift)
                .build();

        ZoneId zone = ZoneId.of("Asia/Ho_Chi_Minh");
        Instant checkIn = workDate.atTime(8, 0).atZone(zone).toInstant();

        AttendanceLog inLog = AttendanceLog.builder()
                .eventType(AttendanceEventType.CHECK_IN)
                .verificationResult(VerificationResult.SUCCESS)
                .occurredAt(checkIn)
                .build();

        ShiftAssignmentRepository saRepo = createStub(ShiftAssignmentRepository.class, Map.of(
                "findByEmployeeIdAndWorkDate", Optional.of(sa)
        ));
        AttendanceRequestRepository reqRepo = createStub(AttendanceRequestRepository.class, Map.of(
                "findApprovedByEmployeeAndDateRange", Collections.emptyList()
        ));
        AttendanceLogRepository logRepo = createStub(AttendanceLogRepository.class, Map.of(
                "findByEmployeeIdAndOccurredAtBetween", List.of(inLog)
        ));
        AttendanceAdjustmentRepository adjRepo = createStub(AttendanceAdjustmentRepository.class, Collections.emptyMap());
        AttendanceCalculationService service = new AttendanceCalculationService(
                logRepo, saRepo, reqRepo, adjRepo, null
        );

        DailyAttendanceRecordResponse res = service.computeDayRecord(employee, workDate);

        assertThat(res.getStatus()).isEqualTo(DailyAttendanceStatus.MISSING_CHECK_OUT);
    }

    @Test
    @DisplayName("Nghỉ tuần: cuối tuần không phân ca")
    void computeDayRecord_WeekendWithoutShift() {
        LocalDate weekendDate = LocalDate.of(2026, 11, 15); // Chủ Nhật

        ShiftAssignmentRepository saRepo = createStub(ShiftAssignmentRepository.class, Map.of(
                "findByEmployeeIdAndWorkDate", Optional.empty()
        ));
        AttendanceRequestRepository reqRepo = createStub(AttendanceRequestRepository.class, Collections.emptyMap());
        AttendanceLogRepository logRepo = createStub(AttendanceLogRepository.class, Collections.emptyMap());
        AttendanceAdjustmentRepository adjRepo = createStub(AttendanceAdjustmentRepository.class, Collections.emptyMap());
        AttendanceCalculationService service = new AttendanceCalculationService(
                logRepo, saRepo, reqRepo, adjRepo, null
        );

        DailyAttendanceRecordResponse res = service.computeDayRecord(employee, weekendDate);

        assertThat(res.getStatus()).isEqualTo(DailyAttendanceStatus.REST_DAY);
        assertThat(res.getWorkCredit()).isEqualTo(BigDecimal.ZERO);
    }
}
