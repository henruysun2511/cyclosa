package com.cyclosa.asset.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Yêu cầu tạo mới loại tài sản")
public class CreateAssetCategoryRequest {

    @NotBlank(message = "Tên loại tài sản không được để trống")
    @Size(max = 100, message = "Tên loại tài sản tối đa 100 ký tự")
    @Schema(description = "Tên loại tài sản", example = "Laptop / Máy tính xách tay")
    private String name;

    @NotBlank(message = "Mã loại tài sản không được để trống")
    @Size(max = 50, message = "Mã loại tài sản tối đa 50 ký tự")
    @Schema(description = "Mã loại tài sản", example = "LAPTOP")
    private String code;

    @Size(max = 500, message = "Mô tả tối đa 500 ký tự")
    @Schema(description = "Mô tả chi tiết", example = "Các dòng máy tính xách tay cấp cho nhân viên")
    private String description;
}
