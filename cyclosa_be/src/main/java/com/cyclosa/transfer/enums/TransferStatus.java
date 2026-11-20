package com.cyclosa.transfer.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum TransferStatus {
    DRAFT("Dự thảo"),
    SUBMITTED("Đã trình duyệt"),
    PENDING_APPROVAL("Chờ phê duyệt"),
    APPROVED("Đã phê duyệt"),
    REJECTED("Từ chối"),
    COMPLETED("Đã hoàn tất / Đã áp dụng"),
    CANCELLED("Đã hủy");

    private final String description;
}
