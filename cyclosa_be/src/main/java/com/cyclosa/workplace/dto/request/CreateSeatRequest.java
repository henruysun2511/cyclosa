package com.cyclosa.workplace.dto.request;

import com.cyclosa.workplace.enums.SeatShape;
import com.cyclosa.workplace.enums.SeatType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Set;
import java.util.UUID;

@Data
public class CreateSeatRequest {
    @NotNull(message = "Cụm bàn không được để trống")
    private UUID seatRowId;

    @NotBlank(message = "Mã bàn không được để trống")
    private String seatCode;

    private SeatType seatType = SeatType.DEDICATED;
    private SeatShape shape = SeatShape.RECTANGLE;

    private BigDecimal x = BigDecimal.ZERO;
    private BigDecimal y = BigDecimal.ZERO;
    private BigDecimal width = BigDecimal.valueOf(60);
    private BigDecimal height = BigDecimal.valueOf(40);
    private BigDecimal rotationDegrees = BigDecimal.ZERO;

    private Set<UUID> amenityIds;
}
