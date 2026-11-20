package com.cyclosa.workplace.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class BookDeskRequest {
    @NotNull(message = "Bàn làm việc không được để trống")
    private UUID seatId;

    @NotNull(message = "Ngày đặt bàn không được để trống")
    private LocalDate bookingDate;

    private String note;
}
