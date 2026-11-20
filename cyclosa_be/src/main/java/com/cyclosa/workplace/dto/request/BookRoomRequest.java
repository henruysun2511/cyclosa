package com.cyclosa.workplace.dto.request;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class BookRoomRequest {
    @NotNull(message = "Phòng họp không được để trống")
    private UUID meetingRoomId;

    private UUID organizerEmployeeId; // Optional: If Office Admin books on behalf of another employee

    @NotBlank(message = "Tiêu đề cuộc họp không được để trống")
    private String title;

    @Min(value = 1, message = "Số lượng người tham dự tối thiểu là 1")
    private Integer attendeeCount = 1;

    @NotNull(message = "Giờ bắt đầu không được để trống")
    @FutureOrPresent(message = "Giờ bắt đầu không được ở quá khứ")
    private LocalDateTime startTime;

    @NotNull(message = "Giờ kết thúc không được để trống")
    private LocalDateTime endTime;

    private String description;
}
