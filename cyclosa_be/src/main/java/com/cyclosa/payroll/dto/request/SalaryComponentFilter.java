package com.cyclosa.payroll.dto.request;

import com.cyclosa.common.dto.request.BaseFilterRequest;
import com.cyclosa.payroll.enums.SalaryComponentCategory;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "Tham số lọc danh mục thành phần lương")
public class SalaryComponentFilter extends BaseFilterRequest {

    @Schema(description = "Nhóm thành phần lương")
    private SalaryComponentCategory category;

    @Schema(description = "Trạng thái kích hoạt")
    private Boolean isActive;
}

