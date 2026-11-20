package com.cyclosa.reward.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Kết quả thẩm định điều kiện và thời hiệu xử lý kỷ luật")
public class DisciplineEligibilityResponse {

    @Schema(description = "Đủ điều kiện xử lý kỷ luật theo luật")
    private Boolean eligible;

    @Schema(description = "Số tháng thời hiệu còn lại")
    private Long remainingLimitationMonths;

    @Schema(description = "Đã hết thời hiệu xử lý hay chưa")
    private Boolean isLimitationExpired;

    @Schema(description = "Nhân viên có thuộc diện tạm hoãn/hạn chế kỷ luật hay không")
    private Boolean isRestricted;

    @Schema(description = "Chi tiết các lý do hạn chế nếu có (thai sản, ốm đau, nuôi con < 12 tháng)")
    private List<String> restrictionReasons;
}

