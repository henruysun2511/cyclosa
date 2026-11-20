package com.cyclosa.offboarding.enums;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Trạng thái hạng mục bàn giao")
public enum ClearanceStatus {
    @Schema(description = "Chờ bàn giao và xác nhận")
    PENDING,

    @Schema(description = "Đã xác nhận hoàn tất bàn giao")
    CLEARED,

    @Schema(description = "Chưa đạt yêu cầu / Bị từ chối")
    REJECTED
}
