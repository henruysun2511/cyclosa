package com.cyclosa.reward.dto.request;

import com.cyclosa.common.dto.request.BaseFilterRequest;
import com.cyclosa.reward.enums.RewardType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@Schema(description = "Tham số lọc danh sách quyết định khen thưởng")
public class RewardDecisionFilter extends BaseFilterRequest {

    @Schema(description = "Lọc theo nhân viên")
    private UUID employeeId;

    @Schema(description = "Lọc theo hình thức khen thưởng")
    private RewardType rewardType;

    @Schema(description = "Lọc từ ngày", example = "2026-01-01")
    private LocalDate from;

    @Schema(description = "Lọc đến ngày", example = "2026-12-31")
    private LocalDate to;
}

