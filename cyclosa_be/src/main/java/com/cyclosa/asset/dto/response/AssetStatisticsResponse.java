package com.cyclosa.asset.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Thống kê chỉ số KPI phân hệ Quản lý tài sản")
public class AssetStatisticsResponse {

    @Schema(description = "Tổng số lượng tài sản trong công ty")
    private long totalAssets;

    @Schema(description = "Số tài sản đang được cấp phát sử dụng")
    private long assignedAssets;

    @Schema(description = "Số tài sản sẵn sàng trong kho")
    private long availableAssets;

    @Schema(description = "Số tài sản đang bảo dưỡng / sửa chữa / hỏng")
    private long maintenanceAssets;

    @Schema(description = "Tổng giá trị tài sản (nguyên giá VND)")
    private BigDecimal totalValue;
}
