package com.cyclosa.asset.dto.request;

import com.cyclosa.asset.enums.AssetCondition;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Yêu cầu cấp phát tài sản cho nhân viên")
public class AssignAssetRequest {

    @NotNull(message = "Nhân viên nhận tài sản không được để trống")
    @Schema(description = "ID nhân viên nhận máy")
    private UUID employeeId;

    @NotNull(message = "Thời điểm bàn giao không được để trống")
    @Schema(description = "Thời điểm bàn giao")
    private LocalDateTime assignedAt;

    @Schema(description = "Tình trạng thiết bị lúc bàn giao")
    @Builder.Default
    private AssetCondition conditionOnAssign = AssetCondition.GOOD;

    @Size(max = 500, message = "Ghi chú tối đa 500 ký tự")
    @Schema(description = "Ghi chú bàn giao")
    private String notes;
}
