package com.cyclosa.payroll.enums;

public enum PayrollLineType {
    BASE_SALARY,          // Lương theo ngày công và nghỉ hưởng lương (Thu nhập)
    OVERTIME,             // Tiền làm thêm giờ (Thu nhập)
    ALLOWANCE,            // Phụ cấp (Thu nhập)
    BONUS,                // Tiền thưởng (Thu nhập)
    REIMBURSEMENT,        // Hoàn trả chi phí (Thu nhập)
    INSURANCE_EMPLOYEE,   // Bảo hiểm bắt buộc phần người lao động đóng (Khấu trừ)
    PERSONAL_INCOME_TAX,  // Thuế thu nhập cá nhân (Khấu trừ)
    ADVANCE_RECOVERY,     // Thu hồi tiền tạm ứng (Khấu trừ)
    DEDUCTION,            // Khấu trừ khác: kỷ luật / bồi thường (Khấu trừ)
    INSURANCE_EMPLOYER    // Bảo hiểm phần Doanh nghiệp đóng (Chi phí DN, KHÔNG trừ Net)
}

