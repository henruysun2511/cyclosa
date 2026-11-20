package com.cyclosa.offboarding.enums;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Lý do xin thôi việc tự nguyện")
public enum ResignationReason {
    @Schema(description = "Cơ hội phát triển nghề nghiệp tốt hơn")
    BETTER_OPPORTUNITY,

    @Schema(description = "Lý do cá nhân / Gia đình")
    PERSONAL_FAMILY,

    @Schema(description = "Lý do sức khỏe")
    HEALTH,

    @Schema(description = "Chuyển nơi cư trú / Địa lý")
    RELOCATION,

    @Schema(description = "Thay đổi định hướng nghề nghiệp")
    CAREER_CHANGE,

    @Schema(description = "Không phù hợp môi trường làm việc")
    WORK_ENVIRONMENT,

    @Schema(description = "Chế độ đãi ngộ & Thu nhập")
    COMPENSATION,

    @Schema(description = "Lý do khác")
    OTHER
}
