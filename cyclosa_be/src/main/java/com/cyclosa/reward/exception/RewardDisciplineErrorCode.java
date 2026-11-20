package com.cyclosa.reward.exception;

import com.cyclosa.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum RewardDisciplineErrorCode implements ErrorCode {

    REWARD_DECISION_NOT_FOUND(4401, "Không tìm thấy quyết định khen thưởng", HttpStatus.NOT_FOUND),
    INVALID_REWARD_AMOUNT(4402, "Thưởng bằng tiền bắt buộc phải nhập số tiền lớn hơn 0", HttpStatus.BAD_REQUEST),
    REWARD_AMOUNT_NOT_ALLOWED(4403, "Hình thức khen thưởng này không được phép nhập số tiền", HttpStatus.BAD_REQUEST),
    REWARD_ALREADY_PUSHED_TO_PAYROLL(4404, "Quyết định khen thưởng đã được chốt vào kỳ lương, không thể chỉnh sửa hoặc xóa", HttpStatus.BAD_REQUEST),
    DISCIPLINE_CASE_NOT_FOUND(4405, "Không tìm thấy hồ sơ kỷ luật yêu cầu", HttpStatus.NOT_FOUND),
    DISCIPLINE_CASE_ALREADY_DECIDED(4406, "Hồ sơ kỷ luật đã được ban hành quyết định chính thức, không thể sửa đổi", HttpStatus.BAD_REQUEST),
    DISCIPLINE_LIMITATION_EXPIRED(4407, "Đã hết thời hiệu xử lý kỷ luật lao động theo quy định pháp luật", HttpStatus.BAD_REQUEST),
    EMPLOYEE_RESTRICTED_FROM_DISCIPLINE(4408, "Không được phép xử lý kỷ luật nhân viên đang trong thời gian được pháp luật bảo vệ", HttpStatus.UNPROCESSABLE_ENTITY),
    INSUFFICIENT_DISCIPLINE_PROCEDURES(4409, "Chưa đủ thủ tục bắt buộc để ban hành quyết định kỷ luật (căn cứ nội quy, bằng chứng, biên bản họp, người tham gia)", HttpStatus.BAD_REQUEST),
    DISMISSAL_REQUIRES_WORKFLOW_APPROVAL(4410, "Hình thức kỷ luật sa thải bắt buộc phải trình phê duyệt qua quy trình Workflow", HttpStatus.BAD_REQUEST),
    INVALID_SALARY_EXTENSION_MONTHS(4411, "Thời hạn kéo dài nâng lương không được vượt quá 06 tháng", HttpStatus.BAD_REQUEST),
    COMPLAINT_NOT_FOUND(4412, "Không tìm thấy đơn khiếu nại yêu cầu", HttpStatus.NOT_FOUND),
    COMPLAINT_ALREADY_CLOSED(4413, "Khiếu nại này đã được giải quyết hoặc đã đóng hồ sơ, không thể thao tác lại", HttpStatus.BAD_REQUEST),
    INVALID_COMPLAINT_TRANSITION(4414, "Trạng thái chuyển đổi khiếu nại không hợp lệ", HttpStatus.BAD_REQUEST),
    DISCIPLINE_EVIDENCE_NOT_FOUND(4415, "Không tìm thấy bằng chứng vi phạm", HttpStatus.NOT_FOUND);

    private final int code;
    private final String message;
    private final HttpStatus httpStatus;
}

