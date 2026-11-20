package com.cyclosa.payroll.enums;

public enum PaymentStatus {
    PENDING,   // Đang chờ lệnh chuyển ngân hàng
    PAID,      // Đã chuyển tiền thành công
    REJECTED   // Ngân hàng từ chối giao dịch
}

