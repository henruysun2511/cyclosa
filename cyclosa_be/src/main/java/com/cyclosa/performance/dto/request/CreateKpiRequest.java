package com.cyclosa.performance.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateKpiRequest {

    @NotBlank(message = "Tên chỉ số KPI không được để trống")
    private String name;

    @NotBlank(message = "Đơn vị tính không được để trống")
    private String unit;

    private String measurementMethod;

    private UUID departmentId;

    @Builder.Default
    private Boolean isActive = true;
}
