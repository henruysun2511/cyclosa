package com.cyclosa.workplace.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateWorkplaceAmenityRequest {
    @NotBlank(message = "Tên tiện ích không được để trống")
    @Size(max = 100, message = "Tên tiện ích tối đa 100 ký tự")
    private String name;

    @Size(max = 50, message = "Icon name tối đa 50 ký tự")
    private String iconName;

    @Size(max = 255, message = "Mô tả tối đa 255 ký tự")
    private String description;
}
