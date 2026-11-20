package com.cyclosa.restructure.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateScenarioDepartmentRequest {

    private UUID parentScenarioDeptId;

    @NotBlank(message = "Mã phòng ban không được để trống")
    @Size(max = 50, message = "Mã phòng ban tối đa 50 ký tự")
    private String code;

    @NotBlank(message = "Tên phòng ban không được để trống")
    @Size(max = 150, message = "Tên phòng ban tối đa 150 ký tự")
    private String name;

    private UUID managerEmployeeId;

    @Builder.Default
    private Integer targetHeadcount = 0;

    @Builder.Default
    private Boolean isPermissionInherited = true;

    private String notes;
}
