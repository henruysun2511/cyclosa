package com.cyclosa.payroll.dto.request;

import com.cyclosa.payroll.enums.ComponentFrequency;
import com.cyclosa.payroll.enums.SalaryComponentCategory;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Schema(description = "Yêu cầu tạo thành phần lương mới")
public class CreateSalaryComponentRequest {

    @NotBlank(message = "Mã thành phần lương không được để trống")
    @Size(max = 50, message = "Mã thành phần lương tối đa 50 ký tự")
    @Schema(description = "Mã thành phần", example = "AN_TRUA")
    private String code;

    @NotBlank(message = "Tên thành phần lương không được để trống")
    @Size(max = 150, message = "Tên thành phần lương tối đa 150 ký tự")
    @Schema(description = "Tên hiển thị", example = "Phụ cấp ăn trưa")
    private String name;

    @NotNull(message = "Nhóm thành phần lương không được để trống")
    @Schema(description = "Nhóm thành phần")
    private SalaryComponentCategory category;

    @NotNull(message = "Tần suất không được để trống")
    @Schema(description = "Tần suất áp dụng")
    private ComponentFrequency frequency;

    @Schema(description = "Số tiền mặc định", example = "730000")
    private BigDecimal defaultAmount;

    @Schema(description = "Có tính thuế TNCN không", example = "true")
    private Boolean isTaxable = true;

    @Schema(description = "Có tính đóng BHXH không", example = "false")
    private Boolean isInsuranceBase = false;

    @Schema(description = "Trạng thái kích hoạt", example = "true")
    private Boolean isActive = true;
}

