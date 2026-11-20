package com.cyclosa.career.dto.request;

import com.cyclosa.career.enums.Readiness;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Yêu cầu thêm ứng viên vào kế hoạch kế nhiệm")
public class AddSuccessionCandidateRequest {

    @NotNull(message = "Nhân viên không được để trống")
    @Schema(description = "ID nhân viên kế cận")
    private UUID employeeId;

    @NotNull(message = "Mức độ sẵn sàng không được để trống")
    @Schema(description = "Mức độ sẵn sàng đảm nhiệm")
    private Readiness readiness;

    @Schema(description = "Ghi chú bồi dưỡng, kế hoạch đào tạo")
    private String developmentNotes;
}
