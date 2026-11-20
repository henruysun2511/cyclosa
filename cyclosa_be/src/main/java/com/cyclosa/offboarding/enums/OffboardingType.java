package com.cyclosa.offboarding.enums;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Loại hồ sơ thôi việc")
public enum OffboardingType {
    @Schema(description = "Nhân viên tự nguyện xin thôi việc")
    RESIGNATION,

    @Schema(description = "Doanh nghiệp chủ động chấm dứt hợp đồng lao động")
    TERMINATION
}
