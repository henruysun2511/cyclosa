package com.cyclosa.workplace.dto.response;

import com.cyclosa.workplace.enums.BookingStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class RoomBookingResponse {
    private UUID id;
    private UUID meetingRoomId;
    private String roomName;
    private Integer capacity;
    private String floorName;
    private String siteName;
    private UUID organizerEmployeeId;
    private String organizerName;
    private String title;
    private Integer attendeeCount;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private BookingStatus status;
    private LocalDateTime checkedInAt;
    private String description;
}
