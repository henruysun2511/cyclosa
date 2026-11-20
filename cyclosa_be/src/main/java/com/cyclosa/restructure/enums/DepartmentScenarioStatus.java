package com.cyclosa.restructure.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum DepartmentScenarioStatus {
    UNCHANGED("Giữ nguyên"),
    ADDED("Thành lập mới"),
    MODIFIED("Có điều chỉnh"),
    MERGED("Đã sáp nhập"),
    SPLIT("Đã chia tách"),
    DISSOLVED("Đã giải thể");

    private final String description;
}
