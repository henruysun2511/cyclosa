package com.cyclosa.asset.dto.request;

import com.cyclosa.asset.enums.AssetCondition;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Yêu cầu ghi nhận hoàn trả tài sản")
public class ReturnAssetRequest {

    @NotNull(message = "Thời điểm hoàn trả không được để trống")
    @Schema(description = "Thời điểm thu hồi / hoàn trả")
    private LocalDateTime returnedAt;

    @Schema(description = "Tình trạng thiết bị lúc nhận lại")
    @Builder.Default
    private AssetCondition conditionOnReturn = AssetCondition.GOOD;

    @Size(max = 500, message = "Ghi chú tối đa 500 ký tự")
    @Schema(description = "Ghi chú hoàn trả")
    private String notes;
}
