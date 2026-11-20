package com.cyclosa.workplace.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateFloorRequest {
    @NotNull(message = "Số tầng không được để trống")
    private Integer floorNumber;

    @NotBlank(message = "Tên tầng không được để trống")
    @Size(max = 100, message = "Tên tầng tối đa 100 ký tự")
    private String name;

    private String description;
}
