package com.cyclosa.career.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Yêu cầu chạy thuật toán mô phỏng sự nghiệp")
public class SimulateCareerRequest {

    @NotNull(message = "Chức danh mục tiêu không được để trống")
    @Schema(description = "ID chức danh mục tiêu kỳ vọng")
    private UUID targetJobTitleId;
}
