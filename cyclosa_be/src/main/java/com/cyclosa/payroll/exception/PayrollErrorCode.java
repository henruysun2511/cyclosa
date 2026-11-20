package com.cyclosa.payroll.exception;

import com.cyclosa.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum PayrollErrorCode implements ErrorCode {

    SALARY_COMPONENT_NOT_FOUND(1901, "Không tìm thấy thành phần lương yêu cầu", HttpStatus.NOT_FOUND),
    SALARY_COMPONENT_CODE_DUPLICATED(1902, "Mã thành phần lương đã tồn tại trong doanh nghiệp", HttpStatus.CONFLICT),
    CANNOT_DELETE_ACTIVE_COMPONENT(1903, "Không thể xóa thành phần lương đang được gán cho nhân viên", HttpStatus.BAD_REQUEST),
    EMPLOYEE_SALARY_ITEM_NOT_FOUND(1904, "Không tìm thấy khoản lương phụ thuộc của nhân viên", HttpStatus.NOT_FOUND),
    DISCIPLINE_CASE_REQUIRED_FOR_DEDUCTION(1905, "Khoản khấu trừ kỷ luật/bồi thường bắt buộc phải gắn với hồ sơ kỷ luật lao động hợp lệ", HttpStatus.BAD_REQUEST),
    SALARY_HISTORY_NOT_FOUND(1906, "Không tìm thấy lịch sử mức lương của nhân viên", HttpStatus.NOT_FOUND),
    SALARY_ADVANCE_NOT_FOUND(1907, "Không tìm thấy đơn tạm ứng tiền lương yêu cầu", HttpStatus.NOT_FOUND),
    ADVANCE_LIMIT_EXCEEDED(1908, "Số tiền tạm ứng vượt quá hạn mức cho phép của doanh nghiệp", HttpStatus.BAD_REQUEST),
    CANNOT_CANCEL_APPROVED_ADVANCE(1909, "Không thể hủy đơn tạm ứng đã được phê duyệt hoặc giải ngân", HttpStatus.BAD_REQUEST),
    CANNOT_DISBURSE_UNAPPROVED_ADVANCE(1910, "Chỉ có thể giải ngân cho đơn tạm ứng đã được phê duyệt", HttpStatus.BAD_REQUEST),
    PAYROLL_PERIOD_NOT_FOUND(1911, "Không tìm thấy kỳ tính lương yêu cầu", HttpStatus.NOT_FOUND),
    PAYROLL_PERIOD_CODE_DUPLICATED(1912, "Mã kỳ tính lương đã tồn tại trong doanh nghiệp", HttpStatus.CONFLICT),
    TIMESHEET_PERIOD_MUST_BE_LOCKED(1913, "Kỳ công tương ứng phải ở trạng thái ĐÃ KHÓA (LOCKED) mới có thể mở kỳ lương", HttpStatus.BAD_REQUEST),
    PAYROLL_PERIOD_ALREADY_LOCKED(1914, "Kỳ tính lương này đã được khóa sổ vĩnh viễn, không thể tính lại hoặc sửa đổi", HttpStatus.BAD_REQUEST),
    PAYROLL_PERIOD_NOT_CALCULATED(1915, "Kỳ tính lương chưa được hoàn tất tính toán", HttpStatus.BAD_REQUEST),
    CANNOT_SUBMIT_NON_CALCULATED_PERIOD(1916, "Chỉ có thể trình duyệt kỳ lương khi đã hoàn tất tính toán tự động", HttpStatus.BAD_REQUEST),
    PAYROLL_PERIOD_NOT_APPROVED(1917, "Kỳ lương chưa được cấp có thẩm quyền phê duyệt để tiến hành chi trả", HttpStatus.BAD_REQUEST),
    PAYROLL_RECORD_NOT_FOUND(1918, "Không tìm thấy bảng lương của nhân viên trong kỳ", HttpStatus.NOT_FOUND),
    PAYROLL_RECORD_LINE_NOT_FOUND(1919, "Không tìm thấy dòng chi tiết bảng lương", HttpStatus.NOT_FOUND),
    ADJUSTMENT_REASON_REQUIRED(1920, "Bắt buộc phải nhập lý do giải trình khi điều chỉnh dòng lương thủ công", HttpStatus.BAD_REQUEST),
    CANNOT_MODIFY_LOCKED_PERIOD(1921, "Không thể thêm, sửa, xóa dòng lương trong kỳ đã chốt hoặc đang trình duyệt", HttpStatus.BAD_REQUEST),
    PAYROLL_PAYMENT_NOT_FOUND(1922, "Không tìm thấy giao dịch chi trả lương", HttpStatus.NOT_FOUND),
    PAYSLIP_NOT_FOUND(1923, "Không tìm thấy phiếu lương điện tử của nhân viên", HttpStatus.NOT_FOUND),
    CANNOT_GENERATE_PAYSLIP_BEFORE_LOCK(1924, "Chỉ có thể phát hành phiếu lương sau khi kỳ lương đã được khóa sổ hoàn tất", HttpStatus.BAD_REQUEST),
    PENDING_PAYMENTS_REMAINING(1925, "Không thể khóa sổ kỳ lương khi vẫn còn giao dịch chi trả đang chờ xử lý", HttpStatus.BAD_REQUEST),
    TIMESHEET_SNAPSHOT_NOT_FOUND(1926, "Không tìm thấy bản chụp công đã chốt của nhân viên", HttpStatus.NOT_FOUND);

    private final int code;
    private final String message;
    private final HttpStatus httpStatus;
}

