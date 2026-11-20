package com.cyclosa.attendance.dto.request;

import com.cyclosa.attendance.enums.AttendanceEventType;
import com.cyclosa.attendance.enums.VerificationResult;
import com.cyclosa.common.dto.request.BaseFilterRequest;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Schema(description = "Tham số lọc nhật ký quẹt thẻ / chấm công")
public class AttendanceLogFilter extends BaseFilterRequest {

    @Schema(description = "Lọc theo nhân viên")
    private UUID employeeId;

    @Schema(description = "Lọc theo loại sự kiện (CHECK_IN, CHECK_OUT)")
    private AttendanceEventType eventType;

    @Schema(description = "Lọc theo kết quả xác thực (SUCCESS, OUT_OF_RANGE, FACE_MISMATCH...)")
    private VerificationResult verificationResult;

    @Schema(description = "Từ thời điểm (ISO-8601)")
    private Instant from;

    @Schema(description = "Đến thời điểm (ISO-8601)")
    private Instant to;
}

