package com.cyclosa.transfer.exception;

import com.cyclosa.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum TransferErrorCode implements ErrorCode {

    TRANSFER_REQUEST_NOT_FOUND(4501, "Không tìm thấy hồ sơ điều chuyển nhân sự", HttpStatus.NOT_FOUND),
    TRANSFER_REQUEST_ALREADY_EXISTS(4502, "Nhân viên đã có hồ sơ điều chuyển đang trong quá trình phê duyệt hoặc chờ hiệu lực", HttpStatus.CONFLICT),
    INVALID_TRANSFER_STATUS(4503, "Trạng thái hồ sơ không hợp lệ cho thao tác này", HttpStatus.BAD_REQUEST),
    NO_DESTINATION_CHANGE(4504, "Thông tin đơn vị tiếp nhận không có thay đổi so với công tác hiện tại của nhân sự", HttpStatus.BAD_REQUEST),
    INVALID_EFFECTIVE_DATE(4505, "Ngày hiệu lực không được nằm trong quá khứ", HttpStatus.BAD_REQUEST),
    INVALID_TEMPORARY_END_DATE(4506, "Hồ sơ điều chuyển tạm thời bắt buộc phải có ngày kết thúc lớn hơn ngày hiệu lực", HttpStatus.BAD_REQUEST),
    CANNOT_DELETE_ACTIVE_TRANSFER(4507, "Chỉ được xóa hồ sơ ở trạng thái Dự thảo hoặc Đã từ chối", HttpStatus.BAD_REQUEST),
    CANNOT_APPLY_TRANSFER(4508, "Chỉ được áp dụng hồ sơ đã được phê duyệt và đã đến ngày hiệu lực", HttpStatus.BAD_REQUEST),
    NOT_TEMPORARY_DISPATCH(4509, "Hồ sơ này không phải là điều chuyển tạm thời / biệt phái", HttpStatus.BAD_REQUEST),
    EMPLOYEE_NOT_FOUND(4510, "Không tìm thấy thông tin nhân viên", HttpStatus.NOT_FOUND),
    DEPARTMENT_NOT_FOUND(4511, "Không tìm thấy phòng ban tiếp nhận", HttpStatus.NOT_FOUND),
    JOB_TITLE_NOT_FOUND(4512, "Không tìm thấy chức danh tiếp nhận", HttpStatus.NOT_FOUND),
    BRANCH_NOT_FOUND(4513, "Không tìm thấy chi nhánh tiếp nhận", HttpStatus.NOT_FOUND),
    ALREADY_RETURNED(4514, "Hồ sơ điều chuyển tạm thời này đã được thực hiện điều chuyển hồi hương", HttpStatus.BAD_REQUEST);

    private final int code;
    private final String message;
    private final HttpStatus httpStatus;
}
