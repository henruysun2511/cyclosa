package com.cyclosa.career.exception;

import com.cyclosa.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum CareerErrorCode implements ErrorCode {

    CAREER_PATH_NOT_FOUND(4701, "Không tìm thấy thông tin lộ trình thăng tiến yêu cầu", HttpStatus.NOT_FOUND),
    CAREER_PATH_ALREADY_EXISTS(4702, "Tuyến thăng tiến giữa hai chức danh này đã tồn tại trong doanh nghiệp", HttpStatus.CONFLICT),
    SAME_JOB_TITLE_NOT_ALLOWED(4703, "Vị trí xuất phát và vị trí mục tiêu không được trùng nhau", HttpStatus.BAD_REQUEST),
    SUCCESSION_PLAN_NOT_FOUND(4704, "Không tìm thấy kế hoạch kế nhiệm cho vị trí này", HttpStatus.NOT_FOUND),
    SUCCESSION_PLAN_ALREADY_EXISTS(4705, "Kế hoạch kế nhiệm cho vị trí tại phòng ban này đã được thiết lập", HttpStatus.CONFLICT),
    CANDIDATE_ALREADY_IN_PLAN(4706, "Nhân viên đã có tên trong danh sách ứng viên kế nhiệm của kế hoạch này", HttpStatus.CONFLICT),
    CANDIDATE_IS_CURRENT_HOLDER(4707, "Không thể đưa người đang đảm nhiệm vị trí vào danh sách kế nhiệm chính họ", HttpStatus.BAD_REQUEST),
    CANDIDATE_NOT_FOUND_IN_PLAN(4708, "Nhân viên không nằm trong danh sách ứng viên kế nhiệm của vị trí này", HttpStatus.NOT_FOUND),
    TALENT_TAG_ALREADY_ASSIGNED(4709, "Nhân viên đã được trao danh hiệu / thẻ nhân tài này trước đó", HttpStatus.CONFLICT),
    TALENT_ENTRY_NOT_FOUND(4710, "Không tìm thấy bản ghi thẻ nhân tài yêu cầu", HttpStatus.NOT_FOUND),
    SIMULATION_NOT_FOUND(4711, "Không tìm thấy kịch bản mô phỏng sự nghiệp yêu cầu", HttpStatus.NOT_FOUND),
    FORBIDDEN_SIMULATION_ACCESS(4712, "Bạn không có quyền xem hoặc chỉnh sửa kịch bản sự nghiệp của người khác", HttpStatus.FORBIDDEN),
    EMPLOYEE_NOT_FOUND(4713, "Không tìm thấy thông tin nhân viên trong hệ thống", HttpStatus.NOT_FOUND),
    JOB_TITLE_NOT_FOUND(4714, "Không tìm thấy chức danh yêu cầu", HttpStatus.NOT_FOUND),
    DEPARTMENT_NOT_FOUND(4715, "Không tìm thấy phòng ban yêu cầu", HttpStatus.NOT_FOUND);

    private final int code;
    private final String message;
    private final HttpStatus httpStatus;
}
