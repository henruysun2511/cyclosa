package com.cyclosa.asset.dto.request;

import com.cyclosa.asset.enums.AssetCondition;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Yêu cầu tạo mới tài sản nhập kho")
public class CreateAssetRequest {

    @NotBlank(message = "Mã tài sản không được để trống")
    @Size(max = 50, message = "Mã tài sản tối đa 50 ký tự")
    @Schema(description = "Mã tài sản duy nhất", example = "AST-2026-0001")
    private String assetCode;

    @NotNull(message = "Loại tài sản không được để trống")
    @Schema(description = "ID loại tài sản")
    private UUID categoryId;

    @NotBlank(message = "Tên tài sản không được để trống")
    @Size(max = 200, message = "Tên tài sản tối đa 200 ký tự")
    @Schema(description = "Tên tài sản", example = "MacBook Pro 16 inch M3 Pro")
    private String name;

    @Size(max = 100, message = "Số serial tối đa 100 ký tự")
    @Schema(description = "Số Serial thiết bị", example = "C02G1234MD6R")
    private String serialNumber;

    @Size(max = 100, message = "Model tối đa 100 ký tự")
    @Schema(description = "Model thiết bị", example = "MacBook Pro A2991")
    private String model;

    @Size(max = 100, message = "Hãng sản xuất tối đa 100 ký tự")
    @Schema(description = "Hãng sản xuất", example = "Apple")
    private String manufacturer;

    @Schema(description = "Thông số kỹ thuật chi tiết", example = "Apple M3 Pro, 36GB RAM, 512GB SSD")
    private String specifications;

    @Schema(description = "Ngày mua / tiếp nhận")
    private LocalDate purchaseDate;

    @Schema(description = "Giá trị mua / nguyên giá (VND)", example = "52000000")
    private BigDecimal purchasePrice;

    @Schema(description = "Tình trạng hiện vật ban đầu")
    @Builder.Default
    private AssetCondition conditionStatus = AssetCondition.NEW;

    @Size(max = 200, message = "Vị trí đặt tối đa 200 ký tự")
    @Schema(description = "Vị trí lưu kho / Văn phòng", example = "Kho IT - Tầng 5 Keangnam")
    private String location;

    @Size(max = 500, message = "Ghi chú tối đa 500 ký tự")
    @Schema(description = "Ghi chú thêm")
    private String notes;
}
