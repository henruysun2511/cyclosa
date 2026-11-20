package com.cyclosa.leave.dto.request;

import com.cyclosa.common.dto.request.BaseFilterRequest;
import com.cyclosa.contract.entity.enums.ContractType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Schema(description = "Bộ lọc chính sách nghỉ phép năm")
public class LeavePolicyFilter extends BaseFilterRequest {

    @Schema(description = "Lọc theo loại nghỉ phép")
    private UUID leaveTypeId;

    @Schema(description = "Lọc theo loại hợp đồng áp dụng")
    private ContractType contractType;
}

