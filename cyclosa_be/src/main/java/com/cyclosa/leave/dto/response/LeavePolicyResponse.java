package com.cyclosa.leave.dto.response;

import com.cyclosa.contract.entity.enums.ContractType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Thông tin chính sách nghỉ phép năm")
public class LeavePolicyResponse {

    @Schema(description = "ID chính sách")
    private UUID id;

    @Schema(description = "ID công ty")
    private UUID companyId;

    @Schema(description = "ID loại nghỉ phép")
    private UUID leaveTypeId;

    @Schema(description = "Mã loại nghỉ")
    private String leaveTypeCode;

    @Schema(description = "Tên loại nghỉ")
    private String leaveTypeName;

    @Schema(description = "Loại hợp đồng áp dụng (null = tất cả)")
    private ContractType contractType;

    @Schema(description = "Ngày bắt đầu có hiệu lực")
    private LocalDate effectiveFrom;

    @Schema(description = "Định mức ngày nghỉ phép cơ bản hằng năm")
    private BigDecimal annualEntitlementDays;

    @Schema(description = "Số năm thâm niên cho mỗi bước tăng ngày phép")
    private Integer seniorityStepYears;

    @Schema(description = "Số ngày phép tăng thêm cho mỗi bước thâm niên")
    private BigDecimal seniorityBonusDays;

    @Schema(description = "Số ngày phép tối đa được chuyển sang năm sau")
    private BigDecimal maxCarryoverDays;

    @Schema(description = "Tháng hết hạn sử dụng ngày phép chuyển tồn")
    private Short carryoverDeadlineMonth;

    @Schema(description = "Mô tả căn cứ chính sách")
    private String description;

    @Schema(description = "Thời điểm tạo")
    private LocalDateTime createdAt;

    @Schema(description = "Thời điểm cập nhật")
    private LocalDateTime updatedAt;
}
