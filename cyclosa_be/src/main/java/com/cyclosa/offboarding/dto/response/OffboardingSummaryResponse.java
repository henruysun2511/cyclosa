package com.cyclosa.offboarding.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Tổng hợp tiến độ và kiểm tra điều kiện hoàn tất thôi việc")
public class OffboardingSummaryResponse {

    @Schema(description = "Thông tin hồ sơ thôi việc")
    private OffboardingRequestResponse request;

    @Schema(description = "Danh sách 5 hạng mục bàn giao")
    @Builder.Default
    private List<OffboardingClearanceItemResponse> clearanceItems = new ArrayList<>();

    @Schema(description = "Thông tin phỏng vấn thôi việc (nếu có)")
    private ExitInterviewResponse exitInterview;

    @Schema(description = "Số lượng tài sản công ty chưa thu hồi")
    @Builder.Default
    private int unreturnedAssetsCount = 0;

    @Schema(description = "Đã đủ điều kiện để bấm hoàn tất thủ tục")
    @Builder.Default
    private boolean canComplete = false;

    @Schema(description = "Danh sách các điều kiện còn thiếu để hoàn tất")
    @Builder.Default
    private List<String> missingPrerequisites = new ArrayList<>();
}
