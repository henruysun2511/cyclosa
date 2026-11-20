package com.cyclosa.reward.dto.request;

import com.cyclosa.reward.enums.ViolationCategory;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@Schema(description = "Yêu cầu mở hồ sơ vi phạm kỷ luật")
public class CreateDisciplineCaseRequest {

    @NotNull(message = "ID nhân viên không được để trống")
    @Schema(description = "ID nhân viên vi phạm")
    private UUID employeeId;

    @NotNull(message = "Ngày vi phạm không được để trống")
    @Schema(description = "Ngày xảy ra hành vi vi phạm", example = "2026-11-10")
    private LocalDate violationDate;

    @NotNull(message = "Nhóm vi phạm không được để trống")
    @Schema(description = "Nhóm vi phạm (GENERAL: thời hiệu 6T, FINANCIAL_ASSET_SECRET: thời hiệu 12T)")
    private ViolationCategory violationCategory;

    @NotBlank(message = "Mô tả vi phạm không được để trống")
    @Schema(description = "Mô tả chi tiết hành vi vi phạm")
    private String violationDescription;

    @Schema(description = "Căn cứ điều khoản Nội quy lao động")
    private String ruleBasis;

    @Schema(description = "Lý do và ghi chú ban đầu")
    private String reason;
}

