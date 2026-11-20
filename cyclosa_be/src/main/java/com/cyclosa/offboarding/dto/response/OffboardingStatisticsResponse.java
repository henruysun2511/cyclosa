package com.cyclosa.offboarding.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Thống kê chỉ số hồ sơ thôi việc")
public class OffboardingStatisticsResponse {

    @Schema(description = "Tổng số hồ sơ thôi việc")
    private long totalRequests;

    @Schema(description = "Số hồ sơ chờ phê duyệt")
    private long pendingApproval;

    @Schema(description = "Số hồ sơ đang trong tiến trình bàn giao")
    private long processingClearance;

    @Schema(description = "Số hồ sơ đã hoàn tất thủ tục")
    private long completed;

    @Schema(description = "Số đơn thôi việc tự nguyện")
    private long resignations;

    @Schema(description = "Số quyết định chấm dứt HĐLĐ")
    private long terminations;
}
