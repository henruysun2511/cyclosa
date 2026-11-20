package com.cyclosa.leave.enums;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Nguồn chi trả chế độ nghỉ")
public enum LeavePayer {
    @Schema(description = "Doanh nghiệp chi trả 100% lương")
    EMPLOYER,

    @Schema(description = "Quỹ Bảo hiểm xã hội chi trả trợ cấp")
    SOCIAL_INSURANCE,

    @Schema(description = "Không hưởng lương / Không trợ cấp")
    NONE
}

