package com.cyclosa.reward.dto.request;

import com.cyclosa.reward.enums.RewardType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@Schema(description = "Yêu cầu lập quyết định khen thưởng")
public class CreateRewardDecisionRequest {

    @NotNull(message = "ID nhân viên không được để trống")
    @Schema(description = "ID nhân viên được khen thưởng")
    private UUID employeeId;

    @NotNull(message = "Hình thức khen thưởng không được để trống")
    @Schema(description = "Hình thức khen thưởng (CERTIFICATE, MONETARY_BONUS, PROMOTION_PROPOSAL, OTHER)")
    private RewardType rewardType;

    @NotBlank(message = "Tiêu đề khen thưởng không được để trống")
    @Size(max = 200, message = "Tiêu đề tối đa 200 ký tự")
    @Schema(description = "Tiêu đề quyết định", example = "Khen thưởng hoàn thành xuất sắc dự án ABC")
    private String title;

    @NotBlank(message = "Lý do khen thưởng không được để trống")
    @Schema(description = "Lý do khen thưởng", example = "Đạt 120% KPI quý và hoàn thành bàn giao dự án trước tiến độ")
    private String reason;

    @DecimalMin(value = "0.0", inclusive = false, message = "Số tiền thưởng phải lớn hơn 0")
    @Schema(description = "Số tiền thưởng (VNĐ) - bắt buộc khi hình thức là MONETARY_BONUS", example = "5000000")
    private BigDecimal amount;

    @NotNull(message = "Người ký quyết định không được để trống")
    @Schema(description = "ID nhân viên lãnh đạo ký quyết định")
    private UUID decidedByEmployeeId;

    @NotNull(message = "Ngày quyết định không được để trống")
    @Schema(description = "Ngày ký quyết định", example = "2026-11-16")
    private LocalDate decisionDate;
}

