package com.cyclosa.asset.dto.request;

import com.cyclosa.asset.enums.AssetCondition;
import com.cyclosa.asset.enums.AssetStatus;
import com.cyclosa.common.dto.request.BaseFilterRequest;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Tham số lọc danh sách tài sản")
public class AssetFilter extends BaseFilterRequest {

    @Schema(description = "Từ khóa tìm kiếm (mã, tên, số serial, model, hãng)")
    private String keyword;

    @Schema(description = "Lọc theo loại tài sản")
    private UUID categoryId;

    @Schema(description = "Lọc theo trạng thái vận hành")
    private AssetStatus status;

    @Schema(description = "Lọc theo tình trạng hiện vật")
    private AssetCondition conditionStatus;

    @Schema(description = "Lọc theo trạng thái cấp phát (true: đang cấp, false: chưa cấp)")
    private Boolean assigned;
}
