package com.cyclosa.leave.exception;

import com.cyclosa.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum LeaveErrorCode implements ErrorCode {

    LEAVE_TYPE_CODE_ALREADY_EXISTS(1701, "Mã loại nghỉ đã tồn tại trong công ty", HttpStatus.CONFLICT),
    LEAVE_TYPE_NOT_FOUND(1702, "Không tìm thấy loại nghỉ phép yêu cầu", HttpStatus.NOT_FOUND),
    LEAVE_TYPE_IN_USE(1703, "Không thể xóa loại nghỉ đang được chính sách hoặc đơn nghỉ phép tham chiếu", HttpStatus.BAD_REQUEST),
    LEAVE_POLICY_NOT_FOUND(1704, "Không tìm thấy chính sách nghỉ phép", HttpStatus.NOT_FOUND),
    LEAVE_POLICY_CONFLICT(1705, "Chính sách nghỉ phép bị trùng lặp với loại hợp đồng và ngày hiệu lực đã có", HttpStatus.CONFLICT),
    LEAVE_BALANCE_NOT_FOUND(1706, "Không tìm thấy quỹ phép của nhân viên trong năm được chọn", HttpStatus.NOT_FOUND),
    LEAVE_BALANCE_ALREADY_EXISTS(1707, "Quỹ phép của nhân viên cho loại nghỉ và năm này đã tồn tại", HttpStatus.CONFLICT),
    LEAVE_REQUEST_NOT_FOUND(1708, "Không tìm thấy đơn xin nghỉ phép yêu cầu", HttpStatus.NOT_FOUND),
    INVALID_LEAVE_DATE_RANGE(1709, "Ngày bắt đầu nghỉ phải nhỏ hơn hoặc bằng ngày kết thúc", HttpStatus.BAD_REQUEST),
    INVALID_HALF_DAY_PORTION(1710, "Nghỉ nửa ngày (sáng/chiều) chỉ áp dụng khi ngày bắt đầu và kết thúc trùng nhau", HttpStatus.BAD_REQUEST),
    OVERLAPPING_LEAVE_REQUEST(1711, "Khoảng thời gian xin nghỉ bị trùng với một đơn nghỉ khác của bạn", HttpStatus.CONFLICT),
    INSUFFICIENT_LEAVE_BALANCE(1712, "Số dư quỹ phép không đủ để thực hiện yêu cầu nghỉ phép này", HttpStatus.UNPROCESSABLE_ENTITY),
    CANNOT_CANCEL_PAST_LEAVE_REQUEST(1713, "Không thể hủy đơn nghỉ phép đã diễn ra trong quá khứ", HttpStatus.BAD_REQUEST),
    LEAVE_REQUEST_ALREADY_PROCESSED(1714, "Đơn nghỉ phép này đã được xử lý hoặc đã hủy trước đó", HttpStatus.BAD_REQUEST),
    NO_APPLICABLE_LEAVE_POLICY(1715, "Không tìm thấy chính sách nghỉ phép năm áp dụng cho nhân viên này", HttpStatus.UNPROCESSABLE_ENTITY);

    private final int code;
    private final String message;
    private final HttpStatus httpStatus;
}

