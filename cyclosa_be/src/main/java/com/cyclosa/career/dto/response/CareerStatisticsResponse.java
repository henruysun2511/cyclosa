package com.cyclosa.career.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Thống kê chỉ số KPI Kế nhiệm & Phát triển nhân sự")
public class CareerStatisticsResponse {

    @Schema(description = "Tổng số vị trí trọng yếu")
    private Long totalKeyPositions;

    @Schema(description = "Số vị trí rủi ro cao/nguy cấp")
    private Long highRiskPositions;

    @Schema(description = "Số ứng viên sẵn sàng thay thế ngay")
    private Long readyNowCandidates;

    @Schema(description = "Tổng số nhân tài trong Talent Pool")
    private Long totalTalents;
}
