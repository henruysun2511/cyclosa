package com.cyclosa.leave.enums;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Trạng thái đơn xin nghỉ phép")
public enum LeaveRequestStatus {
    @Schema(description = "Đang soạn thảo")
    DRAFT,

    @Schema(description = "Đã nộp, chờ phê duyệt")
    PENDING_APPROVAL,

    @Schema(description = "Đã được phê duyệt")
    APPROVED,

    @Schema(description = "Bị từ chối")
    REJECTED,

    @Schema(description = "Đã hủy bởi người tạo")
    CANCELLED
}

