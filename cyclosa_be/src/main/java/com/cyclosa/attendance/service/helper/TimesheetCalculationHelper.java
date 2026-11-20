package com.cyclosa.attendance.service.helper;

import com.cyclosa.attendance.dto.response.DailyAttendanceRecordResponse;
import com.cyclosa.attendance.entity.AttendanceAdjustment;
import com.cyclosa.attendance.entity.AttendanceLog;
import com.cyclosa.attendance.entity.AttendanceRequest;
import com.cyclosa.attendance.entity.Shift;
import com.cyclosa.attendance.enums.AttendanceEventType;
import com.cyclosa.attendance.enums.DailyAttendanceStatus;
import com.cyclosa.attendance.enums.VerificationResult;
import com.cyclosa.employee.entity.Employee;

import java.math.BigDecimal;
import java.time.*;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

/**
 * Helper động cơ tính toán công nhật dựa trên:
 * - Derived State: First-In (lượt vào sớm nhất) & Last-Out (lượt ra muộn nhất)
 * - So khớp dung sai ca làm việc (Grace period)
 * - Đơn giải trình / điều chỉnh công
 */
public final class TimesheetCalculationHelper {

    public static final ZoneId VIETNAM_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");

    private TimesheetCalculationHelper() {}

    /**
     * Thuật toán tính trạng thái và số liệu công trong một ngày làm việc của nhân viên
     */
    public static DailyAttendanceRecordResponse calculateDayRecord(
            Employee emp,
            LocalDate date,
            Shift shift,
            List<AttendanceRequest> approvedRequests,
            Optional<AttendanceAdjustment> adjustmentOpt,
            List<AttendanceLog> logs
    ) {
        // 1. Kiểm tra ngày nghỉ cuối tuần nếu không được phân ca
        boolean isWeekend = date.getDayOfWeek() == DayOfWeek.SATURDAY || date.getDayOfWeek() == DayOfWeek.SUNDAY;
        if (shift == null && isWeekend) {
            return DailyAttendanceRecordResponse.builder()
                    .employeeId(emp.getId())
                    .employeeName(emp.getLastName() + " " + emp.getFirstName())
                    .employeeCode(emp.getEmployeeCode())
                    .workDate(date)
                    .shiftName("Nghỉ tuần")
                    .status(DailyAttendanceStatus.REST_DAY)
                    .workCredit(BigDecimal.ZERO)
                    .lateMinutes(0)
                    .earlyMinutes(0)
                    .build();
        }

        // 2. Nếu có đơn giải trình đã được phê duyệt -> Sử dụng số liệu điều chỉnh
        if (approvedRequests != null && !approvedRequests.isEmpty()) {
            AttendanceRequest req = approvedRequests.get(0);
            Instant adjIn = adjustmentOpt.map(AttendanceAdjustment::getAdjustedCheckIn).orElse(req.getProposedCheckIn());
            Instant adjOut = adjustmentOpt.map(AttendanceAdjustment::getAdjustedCheckOut).orElse(req.getProposedCheckOut());

            return DailyAttendanceRecordResponse.builder()
                    .employeeId(emp.getId())
                    .employeeName(emp.getLastName() + " " + emp.getFirstName())
                    .employeeCode(emp.getEmployeeCode())
                    .workDate(date)
                    .shiftName(shift != null ? shift.getName() : "Ca điều chỉnh")
                    .shiftHours(shift != null ? shift.getStartTime() + " - " + shift.getEndTime() : "08:00 - 17:00")
                    .checkInTime(adjIn)
                    .checkOutTime(adjOut)
                    .status(DailyAttendanceStatus.EXPLAINED)
                    .lateMinutes(0)
                    .earlyMinutes(0)
                    .workCredit(shift != null ? shift.getWorkCredit() : BigDecimal.ONE)
                    .isAdjusted(true)
                    .adjustmentReason(req.getReason())
                    .build();
        }

        // 3. Quét các lượt log quẹt thẻ thực tế thành công: First-In / Last-Out
        Instant firstIn = logs.stream()
                .filter(l -> l.getEventType() == AttendanceEventType.CHECK_IN && l.getVerificationResult() == VerificationResult.SUCCESS)
                .map(AttendanceLog::getOccurredAt)
                .min(Comparator.naturalOrder())
                .orElse(null);

        Instant lastOut = logs.stream()
                .filter(l -> l.getEventType() == AttendanceEventType.CHECK_OUT && l.getVerificationResult() == VerificationResult.SUCCESS)
                .map(AttendanceLog::getOccurredAt)
                .max(Comparator.naturalOrder())
                .orElse(null);

        // Chưa có lượt quẹt thẻ nào -> Vắng mặt
        if (firstIn == null && lastOut == null) {
            return DailyAttendanceRecordResponse.builder()
                    .employeeId(emp.getId())
                    .employeeName(emp.getLastName() + " " + emp.getFirstName())
                    .employeeCode(emp.getEmployeeCode())
                    .workDate(date)
                    .shiftName(shift != null ? shift.getName() : "Ca chuẩn")
                    .status(DailyAttendanceStatus.ABSENT)
                    .workCredit(BigDecimal.ZERO)
                    .lateMinutes(0)
                    .earlyMinutes(0)
                    .build();
        }

        // Thiếu check-out hoặc check-in
        if (firstIn == null || lastOut == null) {
            return DailyAttendanceRecordResponse.builder()
                    .employeeId(emp.getId())
                    .employeeName(emp.getLastName() + " " + emp.getFirstName())
                    .employeeCode(emp.getEmployeeCode())
                    .workDate(date)
                    .shiftName(shift != null ? shift.getName() : "Ca chuẩn")
                    .checkInTime(firstIn)
                    .checkOutTime(lastOut)
                    .status(DailyAttendanceStatus.MISSING_CHECK_OUT)
                    .workCredit(BigDecimal.valueOf(0.5)) // Tạm tính 0.5 công cho đến khi giải trình
                    .lateMinutes(0)
                    .earlyMinutes(0)
                    .build();
        }

        // Đủ 2 đầu check-in và check-out -> So khớp giờ ca
        int lateMin = 0;
        int earlyMin = 0;
        DailyAttendanceStatus status = DailyAttendanceStatus.ON_TIME;

        if (shift != null) {
            LocalTime inTime = firstIn.atZone(VIETNAM_ZONE).toLocalTime();
            LocalTime outTime = lastOut.atZone(VIETNAM_ZONE).toLocalTime();

            int lateDiff = (int) Duration.between(shift.getStartTime(), inTime).toMinutes();
            if (lateDiff > shift.getLateGraceMinutes()) {
                lateMin = lateDiff;
            }

            int earlyDiff = (int) Duration.between(outTime, shift.getEndTime()).toMinutes();
            if (earlyDiff > shift.getEarlyGraceMinutes()) {
                earlyMin = earlyDiff;
            }

            if (lateMin > 0 && earlyMin > 0) {
                status = DailyAttendanceStatus.LATE_AND_EARLY;
            } else if (lateMin > 0) {
                status = DailyAttendanceStatus.LATE;
            } else if (earlyMin > 0) {
                status = DailyAttendanceStatus.EARLY;
            }
        }

        return DailyAttendanceRecordResponse.builder()
                .employeeId(emp.getId())
                .employeeName(emp.getLastName() + " " + emp.getFirstName())
                .employeeCode(emp.getEmployeeCode())
                .workDate(date)
                .shiftName(shift != null ? shift.getName() : "Ca chuẩn")
                .shiftHours(shift != null ? shift.getStartTime() + " - " + shift.getEndTime() : "08:00 - 17:00")
                .checkInTime(firstIn)
                .checkOutTime(lastOut)
                .status(status)
                .lateMinutes(lateMin)
                .earlyMinutes(earlyMin)
                .workCredit(shift != null ? shift.getWorkCredit() : BigDecimal.ONE)
                .build();
    }
}

