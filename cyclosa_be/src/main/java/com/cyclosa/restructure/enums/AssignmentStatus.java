package com.cyclosa.restructure.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum AssignmentStatus {
    UNCHANGED("Giữ nguyên vị trí"),
    TRANSFERRED("Điều chuyển sang đơn vị mới"),
    PROMOTED("Thăng chức / Bổ nhiệm"),
    REDUNDANT("Diện tinh giản biên chế");

    private final String description;
}
