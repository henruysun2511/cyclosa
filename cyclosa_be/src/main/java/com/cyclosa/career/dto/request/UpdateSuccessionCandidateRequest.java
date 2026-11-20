package com.cyclosa.career.dto.request;

import com.cyclosa.career.enums.Readiness;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Yêu cầu cập nhật thông tin ứng viên kế nhiệm")
public class UpdateSuccessionCandidateRequest {

    @NotNull(message = "Mức độ sẵn sàng không được để trống")
    @Schema(description = "Mức độ sẵn sàng đảm nhiệm")
    private Readiness readiness;

    @Schema(description = "Ghi chú bồi dưỡng, kế hoạch đào tạo")
    private String developmentNotes;
}
