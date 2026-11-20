package com.cyclosa.offboarding.enums;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Lý do doanh nghiệp chấm dứt hợp đồng lao động")
public enum TerminationReason {
    @Schema(description = "Không hoàn thành nhiệm vụ theo HĐLĐ / Đánh giá hiệu suất kém")
    PERFORMANCE,

    @Schema(description = "Xử lý kỷ luật lao động hình thức sa thải")
    DISCIPLINARY_DISMISSAL,

    @Schema(description = "Thay đổi cơ cấu tổ chức, công nghệ hoặc lý do kinh tế")
    RESTRUCTURING_DOWNSIZING,

    @Schema(description = "Hết hạn hợp đồng lao động và không gia hạn")
    CONTRACT_EXPIRED_NOT_RENEWED,

    @Schema(description = "Hai bên thỏa thuận chấm dứt hợp đồng lao động")
    MUTUAL_AGREEMENT,

    @Schema(description = "Không đạt yêu cầu trong thời gian thử việc")
    PROBATION_FAILED,

    @Schema(description = "Lý do khác theo luật định")
    OTHER
}
