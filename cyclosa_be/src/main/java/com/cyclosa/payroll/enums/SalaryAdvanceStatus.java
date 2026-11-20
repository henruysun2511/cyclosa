package com.cyclosa.payroll.enums;

public enum SalaryAdvanceStatus {
    DRAFT,             // Bản nháp của nhân viên
    PENDING_APPROVAL,  // Đang chờ phê duyệt qua Workflow
    APPROVED,          // Đã được phê duyệt
    REJECTED,          // Đã bị từ chối
    DISBURSED          // Kế toán đã giải ngân chi trả
}

