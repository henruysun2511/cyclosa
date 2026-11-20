package com.cyclosa.leave.dto.request;

import com.cyclosa.contract.entity.enums.ContractType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Schema(description = "Yêu cầu cập nhật chính sách nghỉ phép năm")
public class UpdateLeavePolicyRequest {

    @Schema(description = "Loại hợp đồng áp dụng (để trống nếu áp dụng mọi loại)")
    private ContractType contractType;

    @NotNull(message = "Ngày hiệu lực không được để trống")
    @Schema(description = "Ngày bắt đầu áp dụng chính sách", example = "2026-01-01")
    private LocalDate effectiveFrom;

    @NotNull(message = "Định mức ngày nghỉ hằng năm không được để trống")
    @DecimalMin(value = "0.0", message = "Định mức ngày nghỉ không được âm")
    @Schema(description = "Định mức ngày nghỉ phép cơ bản hằng năm", example = "12.0")
    private BigDecimal annualEntitlementDays;

    @Schema(description = "Cứ mỗi N năm thâm niên được cộng thêm ngày phép (mặc định 5 năm theo luật)", example = "5")
    private Integer seniorityStepYears;

    @Schema(description = "Số ngày phép cộng thêm cho mỗi bước thâm niên", example = "1.0")
    private BigDecimal seniorityBonusDays;

    @NotNull(message = "Số ngày chuyển tối đa không được để trống")
    @Schema(description = "Số ngày phép tối đa được chuyển sang năm sau (0 = không chuyển)", example = "5.0")
    private BigDecimal maxCarryoverDays;

    @Schema(description = "Tháng hết hạn sử dụng phép chuyển của năm kế tiếp (ví dụ: tháng 3)", example = "3")
    private Short carryoverDeadlineMonth;

    @Schema(description = "Mô tả hoặc ghi chú căn cứ pháp lý")
    private String description;
}

