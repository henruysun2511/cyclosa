package com.cyclosa.workplace.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.UUID;

@Data
public class CreateSiteRequest {
    @NotNull(message = "Chi nhánh không được để trống")
    private UUID branchId;

    @NotBlank(message = "Mã cơ sở không được để trống")
    @Size(max = 30, message = "Mã cơ sở tối đa 30 ký tự")
    private String code;

    @NotBlank(message = "Tên cơ sở không được để trống")
    @Size(max = 150, message = "Tên cơ sở tối đa 150 ký tự")
    private String name;

    @NotBlank(message = "Địa chỉ không được để trống")
    @Size(max = 500, message = "Địa chỉ tối đa 500 ký tự")
    private String address;

    private String description;
}
