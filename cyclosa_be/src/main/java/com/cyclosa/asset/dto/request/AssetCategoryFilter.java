package com.cyclosa.asset.dto.request;

import com.cyclosa.common.dto.request.BaseFilterRequest;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Tham số lọc loại tài sản")
public class AssetCategoryFilter extends BaseFilterRequest {

    @Schema(description = "Từ khóa tìm kiếm (tên hoặc mã)")
    private String keyword;
}
