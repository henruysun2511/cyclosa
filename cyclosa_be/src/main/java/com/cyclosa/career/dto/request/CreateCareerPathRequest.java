package com.cyclosa.career.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Yêu cầu tạo mới tuyến thăng tiến chuẩn")
public class CreateCareerPathRequest {

    @NotNull(message = "Chức danh xuất phát không được để trống")
    @Schema(description = "ID chức danh xuất phát")
    private UUID fromJobTitleId;

    @NotNull(message = "Chức danh mục tiêu không được để trống")
    @Schema(description = "ID chức danh mục tiêu")
    private UUID toJobTitleId;

    @NotNull(message = "Số năm kinh nghiệm tối thiểu không được để trống")
    @DecimalMin(value = "0.0", message = "Số năm kinh nghiệm không thể âm")
    @Schema(description = "Số năm kinh nghiệm chuyên môn tối thiểu", example = "2.0")
    private BigDecimal minExperienceYears;

    @Schema(description = "Yêu cầu năng lực, kỹ năng, chứng chỉ bắt buộc")
    private String requirements;
}
