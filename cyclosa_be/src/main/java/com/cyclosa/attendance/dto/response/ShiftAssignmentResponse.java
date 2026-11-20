package com.cyclosa.attendance.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Thông tin phân ca làm việc của nhân viên")
public class ShiftAssignmentResponse {

    private UUID id;
    private UUID employeeId;
    private String employeeName;
    private String employeeCode;
    private String departmentName;
    private LocalDate workDate;
    private UUID shiftId;
    private String shiftCode;
    private String shiftName;
    private String shiftHours;
    private LocalDateTime createdAt;
}

