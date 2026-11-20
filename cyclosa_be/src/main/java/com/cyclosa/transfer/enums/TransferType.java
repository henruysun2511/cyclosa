package com.cyclosa.transfer.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum TransferType {
    INTERNAL_DEPARTMENT("Điều chuyển nội bộ phòng ban"),
    BRANCH_TRANSFER("Điều chuyển chi nhánh"),
    INTER_COMPANY("Điều chuyển công ty thành viên"),
    ROLE_PROMOTION_DEMOTION("Bổ nhiệm / Thay đổi chức vụ"),
    TEMPORARY_DISPATCH("Điều chuyển tạm thời / Biệt phái");

    private final String description;
}
