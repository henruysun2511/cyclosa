package com.cyclosa.audit.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * 13 mã hành động kiểm toán chuẩn hóa theo đặc tả nghiệp vụ CYCLOSA HRM.
 */
@Getter
@RequiredArgsConstructor
public enum AuditAction {
    CREATE("Tạo mới", "success"),
    UPDATE("Cập nhật", "info"),
    DELETE("Xóa", "destructive"),
    APPROVE("Phê duyệt", "success"),
    REJECT("Từ chối", "destructive"),
    OVERRIDE("Ghi đè/Can thiệp", "warning"),
    EXPORT("Xuất dữ liệu", "secondary"),
    VIEW("Xem thông tin mật", "outline"),
    DOWNLOAD("Tải chứng từ", "outline"),
    LOGIN("Đăng nhập", "default"),
    LOCK("Khóa", "warning"),
    UNLOCK("Mở khóa", "info"),
    PUBLISH("Công bố", "success");

    private final String displayName;
    private final String badgeVariant;
}

