package com.cyclosa.career.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Ứng viên sáng giá do hệ thống tự động gợi ý")
public class SuccessionSuggestionResponse {

    private UUID employeeId;
    private String employeeCode;
    private String employeeName;
    private String departmentName;
    private String jobTitleName;
    private BigDecimal matchScore; // 0 - 100%
    private List<String> matchingFactors; // Lý do gợi ý: "Đã có trong tuyến thăng tiến", "Hiệu suất Xuất sắc", "Top HiPo"...
    private BigDecimal performanceRating;
    private int experienceMonths;
}
