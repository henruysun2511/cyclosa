package com.cyclosa.career.dto.request;

import com.cyclosa.career.enums.RiskLevel;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Yêu cầu cập nhật kế hoạch kế nhiệm")
public class UpdateSuccessionPlanRequest {

    @NotNull(message = "Mức độ rủi ro không được để trống")
    @Schema(description = "Mức độ rủi ro vị trí")
    private RiskLevel riskLevel;

    @NotNull(message = "Ngày rà soát kế hoạch không được để trống")
    @Schema(description = "Ngày rà soát định kỳ")
    private LocalDate reviewDate;
}
