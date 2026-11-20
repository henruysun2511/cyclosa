package com.cyclosa.leave.enums;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Nhóm phân loại nghỉ phép")
public enum LeaveGroup {
    @Schema(description = "Nghỉ phép năm — dùng quỹ phép cá nhân")
    ANNUAL,

    @Schema(description = "Nghỉ lễ, Tết theo quy định nhà nước và công ty")
    PUBLIC_HOLIDAY,

    @Schema(description = "Nghỉ việc riêng có hưởng lương (kết hôn, tang lễ...)")
    PERSONAL_PAID,

    @Schema(description = "Nghỉ việc riêng không hưởng lương")
    PERSONAL_UNPAID,

    @Schema(description = "Nghỉ ốm đau (chế độ bảo hiểm xã hội)")
    SICK,

    @Schema(description = "Nghỉ thai sản (chế độ bảo hiểm xã hội)")
    MATERNITY
}

