package com.cyclosa.notification.enums;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Phân loại thông báo nội bộ")
public enum NotificationType {
    @Schema(description = "Phiếu phê duyệt được giao, kết quả phê duyệt hồ sơ")
    WORKFLOW,

    @Schema(description = "Hợp đồng sắp hết hạn, yêu cầu ký kết hợp đồng điện tử")
    CONTRACT,

    @Schema(description = "Phát hành bảng lương, phiếu lương cá nhân")
    PAYROLL,

    @Schema(description = "Thông báo chính sách, lịch nghỉ lễ, thông điệp chung toàn công ty")
    ANNOUNCEMENT,

    @Schema(description = "Cảnh báo bảo mật tài khoản, thông báo bảo trì hệ thống")
    SYSTEM,

    @Schema(description = "Thông báo đề xuất tuyển dụng, lịch phỏng vấn, thư mời nhận việc")
    RECRUITMENT,

    @Schema(description = "Thông báo đơn xin nghỉ phép, duyệt/từ chối nghỉ phép")
    LEAVE,

    @Schema(description = "Thông báo chấm công, ca làm việc, phê duyệt đơn giải trình")
    ATTENDANCE
}

