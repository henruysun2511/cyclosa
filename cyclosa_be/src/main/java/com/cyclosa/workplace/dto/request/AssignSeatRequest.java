package com.cyclosa.workplace.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class AssignSeatRequest {
    @NotNull(message = "Bàn làm việc không được để trống")
    private UUID seatId;

    @NotNull(message = "Nhân viên không được để trống")
    private UUID employeeId;

    private String note;
}
