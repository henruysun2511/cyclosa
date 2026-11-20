package com.cyclosa.career.dto.request;

import com.cyclosa.career.enums.RiskLevel;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Yêu cầu tạo kế hoạch kế nhiệm cho vị trí trọng yếu")
public class CreateSuccessionPlanRequest {

    @NotNull(message = "Phòng ban không được để trống")
    @Schema(description = "ID phòng ban")
    private UUID departmentId;

    @NotNull(message = "Chức danh không được để trống")
    @Schema(description = "ID chức danh trọng yếu")
    private UUID jobTitleId;

    @NotNull(message = "Mức độ rủi ro không được để trống")
    @Schema(description = "Mức độ rủi ro vị trí")
    private RiskLevel riskLevel;

    @NotNull(message = "Ngày rà soát kế hoạch không được để trống")
    @Schema(description = "Ngày rà soát định kỳ")
    private LocalDate reviewDate;
}
