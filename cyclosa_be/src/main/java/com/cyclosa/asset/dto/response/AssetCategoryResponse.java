package com.cyclosa.asset.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Thông tin loại tài sản")
public class AssetCategoryResponse {

    private UUID id;
    private UUID companyId;
    private String name;
    private String code;
    private String description;
    private long assetCount;
    private LocalDateTime createdAt;
}
