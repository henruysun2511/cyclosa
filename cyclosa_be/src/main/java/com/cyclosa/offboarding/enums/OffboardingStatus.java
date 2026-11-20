package com.cyclosa.offboarding.enums;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Trạng thái hồ sơ thôi việc")
public enum OffboardingStatus {
    @Schema(description = "Chờ người có thẩm quyền phê duyệt")
    PENDING,

    @Schema(description = "Đã phê duyệt / Quyết định có hiệu lực")
    APPROVED,

    @Schema(description = "Đang trong quá trình bàn giao 5 hạng mục")
    PROCESSING,

    @Schema(description = "Đã hoàn tất toàn bộ thủ tục thôi việc")
    COMPLETED,

    @Schema(description = "Đã từ chối đơn xin thôi việc")
    REJECTED,

    @Schema(description = "Đã hủy bỏ hồ sơ")
    CANCELLED
}
