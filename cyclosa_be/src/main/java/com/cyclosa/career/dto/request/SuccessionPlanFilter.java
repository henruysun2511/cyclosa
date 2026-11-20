package com.cyclosa.career.dto.request;

import com.cyclosa.career.enums.RiskLevel;
import com.cyclosa.common.dto.request.BaseFilterRequest;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Tham số lọc danh sách kế hoạch kế nhiệm")
public class SuccessionPlanFilter extends BaseFilterRequest {

    @Schema(description = "ID phòng ban")
    private UUID departmentId;

    @Schema(description = "Mức độ rủi ro vị trí")
    private RiskLevel riskLevel;
}
