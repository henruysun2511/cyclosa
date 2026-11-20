package com.cyclosa.career.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Yêu cầu cập nhật lộ trình thăng tiến")
public class UpdateCareerPathRequest {

    @NotNull(message = "Số năm kinh nghiệm tối thiểu không được để trống")
    @DecimalMin(value = "0.0", message = "Số năm kinh nghiệm không thể âm")
    @Schema(description = "Số năm kinh nghiệm chuyên môn tối thiểu", example = "2.5")
    private BigDecimal minExperienceYears;

    @Schema(description = "Yêu cầu năng lực, kỹ năng, chứng chỉ bắt buộc")
    private String requirements;
}
