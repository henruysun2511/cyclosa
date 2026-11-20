package com.cyclosa.restructure.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ScenarioStatus {
    DRAFT("Bản nháp"),
    ANALYZING("Đang phân tích"),
    SUBMITTED("Chờ phê duyệt"),
    APPROVED("Đã phê duyệt"),
    REJECTED("Bị từ chối"),
    EXECUTED("Đã áp dụng"),
    CANCELLED("Đã hủy bỏ");

    private final String description;
}
