package com.cyclosa.restructure.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ScenarioScope {
    COMPANY_WIDE("Toàn công ty"),
    DIVISION_LEVEL("Cấp Khối / Ban"),
    DEPARTMENT_LEVEL("Cấp Phòng ban");

    private final String description;
}
