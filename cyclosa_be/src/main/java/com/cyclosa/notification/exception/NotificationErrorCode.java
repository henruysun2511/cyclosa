package com.cyclosa.notification.exception;

import com.cyclosa.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

/**
 * Danh mục mã lỗi nghiệp vụ module Thông báo nội bộ (Dải mã 2001 - 2020)
 */
@Getter
@RequiredArgsConstructor
public enum NotificationErrorCode implements ErrorCode {

    NOTIFICATION_NOT_FOUND              (2001, "Thông báo không tồn tại hoặc đã bị xóa", HttpStatus.NOT_FOUND),
    NOTIFICATION_ACCESS_DENIED          (2002, "Bạn không có quyền thao tác trên thông báo của người khác", HttpStatus.FORBIDDEN),
    NOTIFICATION_TITLE_REQUIRED         (2003, "Tiêu đề thông báo không được để trống", HttpStatus.BAD_REQUEST),
    NOTIFICATION_CONTENT_TOO_LONG       (2004, "Nội dung thông báo vượt quá độ dài cho phép", HttpStatus.BAD_REQUEST),
    NOTIFICATION_BROADCAST_EMPTY_TARGET (2005, "Không có người nhận hợp lệ nào trong công ty để phát thông báo", HttpStatus.BAD_REQUEST),
    NOTIFICATION_BROADCAST_PERMISSION_DENIED (2006, "Bạn không có quyền phát thông báo toàn công ty", HttpStatus.FORBIDDEN);

    private final int code;
    private final String message;
    private final HttpStatus httpStatus;
}

