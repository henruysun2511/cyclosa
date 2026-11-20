package com.cyclosa.career.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum TalentTag {
    HIPO("High Potential - Tiềm năng phát triển vượt trội"),
    KEY_TALENT("Nhân tài then chốt - Nắm giữ bí quyết / khó thay thế"),
    LEADERSHIP_POTENTIAL("Tiềm năng lãnh đạo - Tố chất dẫn dắt đội ngũ"),
    TECH_EXPERT("Chuyên gia công nghệ - Giải quyết bài toán kỹ thuật chuyên sâu");

    private final String description;
}
