package com.cyclosa.restructure.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ConflictSeverity {
    CRITICAL("Nghiêm trọng (Chặn áp dụng)"),
    WARNING("Cảnh báo cần lưu ý"),
    INFO("Thông tin tham khảo");

    private final String description;
}
