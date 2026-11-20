package com.cyclosa.audit.exception;

import com.cyclosa.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

/**
 * Mã lỗi nghiệp vụ chuẩn hóa cho phân hệ Nhật ký kiểm toán (Dải mã 21xxx).
 */
@Getter
@RequiredArgsConstructor
public enum AuditErrorCode implements ErrorCode {

    AUDIT_LOG_NOT_FOUND(21001, "Bản ghi nhật ký kiểm toán không tồn tại", HttpStatus.NOT_FOUND),
    AUDIT_ACCESS_DENIED(21002, "Bạn không có quyền truy cập nhật ký kiểm toán hệ thống", HttpStatus.FORBIDDEN),
    AUDIT_EXPORT_PERMISSION_DENIED(21003, "Bạn không có quyền trích xuất dữ liệu nhật ký kiểm toán", HttpStatus.FORBIDDEN),
    AUDIT_DATE_RANGE_INVALID(21004, "Khoảng thời gian tra cứu không hợp lệ hoặc vượt quá 180 ngày", HttpStatus.BAD_REQUEST),
    AUDIT_ENTITY_INVALID(21005, "Loại thực thể hoặc ID đối tượng tra cứu không hợp lệ", HttpStatus.BAD_REQUEST),
    AUDIT_ACTION_UNSUPPORTED(21006, "Mã hành động kiểm toán không được hỗ trợ", HttpStatus.BAD_REQUEST),
    AUDIT_EXPORT_LIMIT_EXCEEDED(21007, "Số lượng bản ghi yêu cầu xuất file vượt quá hạn mức 50,000 dòng", HttpStatus.BAD_REQUEST),
    AUDIT_LOGGING_FAILED(21008, "Ghi nhận sự kiện kiểm toán hệ thống gặp lỗi bất khả kháng", HttpStatus.INTERNAL_SERVER_ERROR);

    private final int code;
    private final String message;
    private final HttpStatus httpStatus;
}

