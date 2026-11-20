package com.cyclosa.document.dto.request;

import com.cyclosa.common.dto.request.BaseFilterRequest;
import com.cyclosa.document.enums.DossierPurpose;
import com.cyclosa.document.enums.DossierStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Schema(description = "Tham số tìm kiếm và phân trang bộ hồ sơ nhân sự (Dossier)")
public class DossierFilter extends BaseFilterRequest {

    @Schema(description = "Lọc theo nhân viên sở hữu", example = "3fa85f64-5717-4562-b3fc-2c963f66afa6")
    private UUID employeeId;

    @Schema(description = "Lọc theo mục đích hồ sơ", example = "EMPLOYEE_LIFECYCLE")
    private DossierPurpose purpose;

    @Schema(description = "Lọc theo trạng thái bộ hồ sơ", example = "ACTIVE")
    private DossierStatus status;
}
