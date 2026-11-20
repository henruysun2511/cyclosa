package com.cyclosa.workplace.dto.response;

import com.cyclosa.workplace.enums.BookingStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class DeskBookingResponse {
    private UUID id;
    private UUID seatId;
    private String seatCode;
    private String floorName;
    private String siteName;
    private UUID employeeId;
    private String employeeName;
    private String employeeCode;
    private LocalDate bookingDate;
    private BookingStatus status;
    private LocalDateTime checkedInAt;
    private LocalDateTime cancelledAt;
    private String qrToken;
    private String note;
}
