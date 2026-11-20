package com.cyclosa.transfer.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum TransferReason {
    BUSINESS_NEED("Yêu cầu sản xuất kinh doanh"),
    PROMOTION("Thăng chức / Bổ nhiệm"),
    CAREER_DEVELOPMENT("Phát triển năng lực & luân chuyển cán bộ"),
    PERFORMANCE("Kết quả đánh giá hiệu suất"),
    RESTRUCTURING("Tái cơ cấu tổ chức"),
    EMPLOYEE_REQUEST("Nguyện vọng cá nhân của nhân sự"),
    TEMPORARY_PROJECT("Dự án đặc thù ngắn hạn"),
    OTHER("Lý do khác");

    private final String description;
}
