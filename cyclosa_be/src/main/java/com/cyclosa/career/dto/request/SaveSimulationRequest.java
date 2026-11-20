package com.cyclosa.career.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Yêu cầu lưu kịch bản mô phỏng sự nghiệp cá nhân")
public class SaveSimulationRequest {

    @NotBlank(message = "Tên kịch bản không được để trống")
    @Schema(description = "Tên kịch bản", example = "Mục tiêu Tech Lead 2028")
    private String title;

    @NotEmpty(message = "Danh sách bước không được rỗng")
    @Schema(description = "Các chặng thăng tiến")
    private List<StepItem> steps;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class StepItem {
        private int stepOrder;
        private UUID jobTitleId;
        private BigDecimal matchPercent;
    }
}
