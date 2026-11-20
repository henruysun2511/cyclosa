package com.cyclosa.offboarding.dto.request;

import com.cyclosa.offboarding.enums.ClearanceStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Yêu cầu cập nhật trạng thái hạng mục bàn giao")
public class UpdateClearanceItemRequest {

    @NotNull(message = "Trạng thái bàn giao không được để trống")
    @Schema(description = "Trạng thái xác nhận bàn giao (CLEARED / REJECTED / PENDING)", requiredMode = Schema.RequiredMode.REQUIRED)
    private ClearanceStatus status;

    @Schema(description = "Ghi chú xác nhận hoặc lý do từ chối")
    private String notes;
}
