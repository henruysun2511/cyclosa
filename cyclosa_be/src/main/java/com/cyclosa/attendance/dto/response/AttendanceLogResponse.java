package com.cyclosa.attendance.dto.response;

import com.cyclosa.attendance.enums.AttendanceEventType;
import com.cyclosa.attendance.enums.VerificationResult;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Chi tiết bản ghi quẹt thẻ chấm công")
public class AttendanceLogResponse {

    private UUID id;
    private String transactionCode;
    private UUID employeeId;
    private String employeeName;
    private String employeeCode;
    private String departmentName;
    private AttendanceEventType eventType;
    private Instant occurredAt;
    private VerificationResult verificationResult;
    private BigDecimal faceMatchScore;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private UUID livePhotoFileId;
    private String deviceInfo;
    private LocalDateTime createdAt;
}

