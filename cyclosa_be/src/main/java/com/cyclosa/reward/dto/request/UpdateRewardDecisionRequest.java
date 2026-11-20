package com.cyclosa.reward.dto.request;

import com.cyclosa.reward.enums.RewardType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@Schema(description = "Yêu cầu cập nhật quyết định khen thưởng")
public class UpdateRewardDecisionRequest {

    @Schema(description = "Hình thức khen thưởng")
    private RewardType rewardType;

    @Size(max = 200, message = "Tiêu đề tối đa 200 ký tự")
    @Schema(description = "Tiêu đề quyết định")
    private String title;

    @Schema(description = "Lý do khen thưởng")
    private String reason;

    @DecimalMin(value = "0.0", inclusive = false, message = "Số tiền thưởng phải lớn hơn 0")
    @Schema(description = "Số tiền thưởng")
    private BigDecimal amount;

    @Schema(description = "ID nhân viên ký quyết định")
    private UUID decidedByEmployeeId;

    @Schema(description = "Ngày quyết định")
    private LocalDate decisionDate;
}

