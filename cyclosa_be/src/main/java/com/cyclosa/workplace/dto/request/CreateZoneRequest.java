package com.cyclosa.workplace.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
public class CreateZoneRequest {
    @NotBlank(message = "Tên phân khu không được để trống")
    @Size(max = 100, message = "Tên phân khu tối đa 100 ký tự")
    private String name;

    private UUID departmentId;

    private String colorHex = "#3B82F6";

    private List<BoundaryPointDto> boundaryPoints;

    @Data
    public static class BoundaryPointDto {
        private Integer pointOrder;
        private BigDecimal x;
        private BigDecimal y;
    }
}
