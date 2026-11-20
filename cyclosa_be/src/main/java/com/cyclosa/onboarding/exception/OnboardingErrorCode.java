package com.cyclosa.onboarding.exception;

import com.cyclosa.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum OnboardingErrorCode implements ErrorCode {

    TEMPLATE_NOT_FOUND                         (1601, "Không tìm thấy mẫu checklist hội nhập", HttpStatus.NOT_FOUND),
    PROCESS_NOT_FOUND                          (1602, "Không tìm thấy tiến trình hội nhập", HttpStatus.NOT_FOUND),
    TASK_NOT_FOUND                             (1603, "Không tìm thấy công việc hội nhập", HttpStatus.NOT_FOUND),
    ACTIVE_PROCESS_ALREADY_EXISTS              (1604, "Nhân viên này đã có một tiến trình hội nhập đang thực hiện", HttpStatus.CONFLICT),
    PROCESS_ALREADY_COMPLETED                  (1605, "Tiến trình hội nhập này đã hoàn tất, không thể chỉnh sửa", HttpStatus.BAD_REQUEST),
    PROCESS_ALREADY_CANCELLED                  (1606, "Tiến trình hội nhập này đã bị hủy bỏ", HttpStatus.BAD_REQUEST),
    CANNOT_ACCEPT_UNFINISHED_MANDATORY_TASKS   (1607, "Không thể nghiệm thu do vẫn còn các công việc bắt buộc chưa hoàn thành", HttpStatus.UNPROCESSABLE_ENTITY),
    CANNOT_SKIP_MANDATORY_TASK                 (1608, "Không thể bỏ qua công việc bắt buộc trong quy trình hội nhập", HttpStatus.UNPROCESSABLE_ENTITY),
    IT_REQUEST_NOT_FOUND                       (1609, "Không tìm thấy yêu cầu cấp tài khoản CNTT", HttpStatus.NOT_FOUND),
    IT_REQUEST_ALREADY_PROCESSED               (1610, "Yêu cầu cấp tài khoản này đã được xử lý trước đó", HttpStatus.BAD_REQUEST),
    ORIENTATION_SESSION_NOT_FOUND              (1611, "Không tìm thấy buổi đào tạo định hướng", HttpStatus.NOT_FOUND),
    ORIENTATION_SESSION_ALREADY_COMPLETED      (1612, "Buổi đào tạo định hướng này đã hoàn thành, không thể sửa đổi", HttpStatus.BAD_REQUEST),
    IT_ACCOUNT_TYPE_NOT_FOUND                  (1613, "Không tìm thấy loại tài khoản CNTT", HttpStatus.NOT_FOUND),
    IT_ACCOUNT_TYPE_NAME_DUPLICATED            (1614, "Tên loại tài khoản CNTT đã tồn tại trong doanh nghiệp", HttpStatus.CONFLICT),
    IT_ACCOUNT_TYPE_IN_USE                     (1615, "Loại tài khoản này đang được sử dụng trong các mẫu checklist, không thể xóa", HttpStatus.BAD_REQUEST);

    private final int code;
    private final String message;
    private final HttpStatus httpStatus;
}

