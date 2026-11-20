package com.cyclosa.offboarding.enums;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Hạng mục bàn giao thủ tục thôi việc")
public enum ClearanceType {
    @Schema(description = "Bàn giao công việc và tài liệu cho người kế nhiệm")
    JOB_HANDOVER,

    @Schema(description = "Hoàn trả trang thiết bị và tài sản công ty (Laptop, thẻ, chìa khóa...)")
    ASSET,

    @Schema(description = "Thu hồi tài khoản hệ thống công nghệ thông tin (Email, VPN, Jira, ERP...)")
    IT_ACCOUNT,

    @Schema(description = "Quyết toán công nợ và tạm ứng tài chính nội bộ")
    FINANCE,

    @Schema(description = "Bàn giao hồ sơ, chốt sổ BHXH và giấy tờ liên quan")
    DOCUMENT
}
