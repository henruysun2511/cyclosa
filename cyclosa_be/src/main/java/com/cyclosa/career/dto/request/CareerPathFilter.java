package com.cyclosa.career.dto.request;

import com.cyclosa.common.dto.request.BaseFilterRequest;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Tham số lọc danh sách lộ trình thăng tiến")
public class CareerPathFilter extends BaseFilterRequest {

    @Schema(description = "ID chức danh xuất phát")
    private UUID fromJobTitleId;

    @Schema(description = "ID chức danh mục tiêu")
    private UUID toJobTitleId;
}
