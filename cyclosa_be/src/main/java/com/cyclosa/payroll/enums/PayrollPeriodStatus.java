package com.cyclosa.payroll.enums;

public enum PayrollPeriodStatus {
    OPEN,               // Mở kỳ, chuẩn bị dữ liệu & pre-check
    CALCULATED,         // Đã tính toán xong, kế toán rà soát bất thường
    PENDING_APPROVAL,   // Đã trình phê duyệt (Bảng lương khóa chế độ Read-only)
    APPROVED,           // Đã được phê duyệt, sẵn sàng giải ngân
    PAYMENT_PROCESSING, // Đang trong quá trình chi trả qua ngân hàng
    LOCKED              // Đã khóa sổ vĩnh viễn, phát hành phiếu lương
}

