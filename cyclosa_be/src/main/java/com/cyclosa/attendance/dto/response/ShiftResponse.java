package com.cyclosa.attendance.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Thông tin chi tiết ca làm việc")
public class ShiftResponse {

    private UUID id;
    private UUID companyId;
    private String code;
    private String name;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer breakMinutes;
    private BigDecimal workCredit;
    private Integer lateGraceMinutes;
    private Integer earlyGraceMinutes;
    private Boolean isActive;
    private Boolean isNightShift;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

