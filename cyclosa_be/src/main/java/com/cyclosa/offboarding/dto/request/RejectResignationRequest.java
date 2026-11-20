package com.cyclosa.offboarding.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Yêu cầu từ chối đơn xin thôi việc")
public class RejectResignationRequest {

    @NotBlank(message = "Lý do từ chối không được để trống")
    @Schema(description = "Lý do từ chối phê duyệt đơn xin thôi việc", requiredMode = Schema.RequiredMode.REQUIRED)
    private String rejectionReason;
}
