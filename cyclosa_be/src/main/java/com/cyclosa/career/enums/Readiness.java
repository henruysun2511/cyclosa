package com.cyclosa.career.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Readiness {
    READY_NOW("Sẵn sàng đảm nhiệm ngay (0-3 tháng)"),
    READY_1_2_YEARS("Cần bồi dưỡng thêm 1-2 năm"),
    READY_3_5_YEARS("Nguồn nhân lực kế cận dài hạn (3-5 năm)");

    private final String description;
}
