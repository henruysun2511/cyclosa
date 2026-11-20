package com.cyclosa.attendance.exception;

import com.cyclosa.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum AttendanceErrorCode implements ErrorCode {

    SHIFT_NOT_FOUND(1801, "Không tìm thấy ca làm việc yêu cầu", HttpStatus.NOT_FOUND),
    SHIFT_CODE_DUPLICATED(1802, "Mã ca làm việc đã tồn tại trong doanh nghiệp", HttpStatus.CONFLICT),
    CANNOT_DELETE_ASSIGNED_SHIFT(1803, "Không thể xóa ca làm việc đã được phân cho nhân viên", HttpStatus.BAD_REQUEST),
    INVALID_SHIFT_HOURS(1804, "Thời gian ca làm việc và giờ nghỉ không hợp lệ", HttpStatus.BAD_REQUEST),
    OVERLAPPING_SHIFT_ASSIGNMENT(1805, "Nhân viên đã được phân ca làm việc khác trong ngày này", HttpStatus.CONFLICT),
    DUPLICATE_PUNCH_TRANSACTION(1806, "Mã giao dịch chấm công bị trùng lặp", HttpStatus.BAD_REQUEST),
    GPS_OUT_OF_RANGE(1807, "Vị trí hiện tại nằm ngoài bán kính cho phép của văn phòng", HttpStatus.FORBIDDEN),
    FACE_BIOMETRIC_NOT_ENROLLED(1808, "Nhân viên chưa đăng ký sinh trắc học khuôn mặt", HttpStatus.UNPROCESSABLE_ENTITY),
    FACE_VERIFICATION_FAILED(1809, "Khuôn mặt không khớp với hồ sơ nhân viên đã đăng ký", HttpStatus.UNPROCESSABLE_ENTITY),
    LIVENESS_CHECK_FAILED(1810, "Xác thực người thật không thành công (nghi vấn gian lận)", HttpStatus.UNPROCESSABLE_ENTITY),
    ATTENDANCE_REQUEST_NOT_FOUND(1811, "Không tìm thấy đơn giải trình yêu cầu", HttpStatus.NOT_FOUND),
    CANNOT_CANCEL_APPROVED_REQUEST(1812, "Không thể hủy đơn giải trình đã được phê duyệt", HttpStatus.BAD_REQUEST),
    ATTENDANCE_REQUEST_ALREADY_EXISTS(1813, "Đã tồn tại đơn giải trình đang chờ xử lý cho ngày này", HttpStatus.CONFLICT),
    TIMESHEET_PERIOD_DUPLICATED(1814, "Kỳ công tháng này đã được khởi tạo trong doanh nghiệp", HttpStatus.CONFLICT),
    TIMESHEET_PERIOD_NOT_FOUND(1815, "Không tìm thấy kỳ công tháng yêu cầu", HttpStatus.NOT_FOUND),
    TIMESHEET_PERIOD_ALREADY_LOCKED(1816, "Kỳ công này đã được khóa sổ và chuyển sang tính lương", HttpStatus.BAD_REQUEST),
    UNRESOLVED_EXCEPTIONS_REMAINING(1817, "Không thể khóa kỳ vì còn đơn giải trình chưa được duyệt", HttpStatus.BAD_REQUEST),
    UNLOCK_REASON_REQUIRED(1818, "Bắt buộc phải nhập lý do khi mở khóa kỳ công", HttpStatus.BAD_REQUEST);

    private final int code;
    private final String message;
    private final HttpStatus httpStatus;
}

