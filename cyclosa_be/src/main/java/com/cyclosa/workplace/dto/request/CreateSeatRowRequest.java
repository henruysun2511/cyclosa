package com.cyclosa.workplace.dto.request;

import com.cyclosa.workplace.enums.RowLayoutType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateSeatRowRequest {
    @NotBlank(message = "Mã cụm bàn không được để trống")
    @Size(max = 30, message = "Mã cụm bàn tối đa 30 ký tự")
    private String code;

    @NotNull(message = "Kiểu bố trí không được để trống")
    private RowLayoutType layoutType = RowLayoutType.SINGLE_ROW;

    private BigDecimal x = BigDecimal.ZERO;
    private BigDecimal y = BigDecimal.ZERO;
    private BigDecimal rotationDegrees = BigDecimal.ZERO;
}
