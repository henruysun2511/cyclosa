package com.cyclosa.career.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Hồ sơ nhân viên tương đồng đã thăng tiến thành công (dữ liệu ẩn danh)")
public class SimilarProfileResponse {

    @Schema(description = "Mã hồ sơ ẩn danh (ví dụ: ANONYMOUS-01)")
    private String anonymousId;

    @Schema(description = "Vị trí khởi điểm")
    private String startJobTitleName;

    @Schema(description = "Vị trí đạt được hiện tại")
    private String currentJobTitleName;

    @Schema(description = "Tổng thời gian thăng tiến (tháng)")
    private Integer totalTransitionMonths;

    @Schema(description = "Điểm đánh giá hiệu suất trung bình")
    private BigDecimal averagePerformanceScore;

    @Schema(description = "Các mốc chức danh đã đi qua")
    private List<String> careerMilestones;
}
