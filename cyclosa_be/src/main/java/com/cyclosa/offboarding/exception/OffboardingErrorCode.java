package com.cyclosa.offboarding.exception;

import com.cyclosa.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum OffboardingErrorCode implements ErrorCode {

    OFFBOARDING_REQUEST_NOT_FOUND(4401, "Không tìm thấy hồ sơ thôi việc", HttpStatus.NOT_FOUND),
    OFFBOARDING_REQUEST_ALREADY_EXISTS(4402, "Nhân viên đã có hồ sơ thôi việc đang trong quá trình xử lý", HttpStatus.CONFLICT),
    INVALID_OFFBOARDING_STATUS(4403, "Trạng thái hồ sơ không hợp lệ cho thao tác này", HttpStatus.BAD_REQUEST),
    CLEARANCE_ITEM_NOT_FOUND(4404, "Không tìm thấy hạng mục bàn giao", HttpStatus.NOT_FOUND),
    EXIT_INTERVIEW_NOT_FOUND(4405, "Chưa có thông tin phỏng vấn thôi việc", HttpStatus.NOT_FOUND),
    CANNOT_COMPLETE_OFFBOARDING(4406, "Chưa đủ điều kiện hoàn tất thủ tục thôi việc (tất cả 5 hạng mục bàn giao phải được xác nhận hoàn tất)", HttpStatus.BAD_REQUEST),
    NOTICE_PERIOD_NOT_MET(4407, "Thời hạn báo trước chưa đáp ứng quy định", HttpStatus.BAD_REQUEST),
    EMPLOYEE_NOT_FOUND(4408, "Không tìm thấy thông tin nhân viên", HttpStatus.NOT_FOUND),
    CANNOT_DELETE_ACTIVE_REQUEST(4409, "Chỉ được xóa hồ sơ ở trạng thái Chờ phê duyệt hoặc Đã từ chối", HttpStatus.BAD_REQUEST),
    UNRETURNED_ASSETS_EXIST(4410, "Nhân viên vẫn còn tài sản công ty chưa bàn giao hoàn trả", HttpStatus.BAD_REQUEST);

    private final int code;
    private final String message;
    private final HttpStatus httpStatus;
}
