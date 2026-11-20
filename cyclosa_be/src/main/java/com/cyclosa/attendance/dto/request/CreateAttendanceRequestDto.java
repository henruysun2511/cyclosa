package com.cyclosa.attendance.dto.request;

import com.cyclosa.attendance.enums.AttendanceRequestType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@Schema(description = "Yêu cầu gửi đơn giải trình chấm công")
public class CreateAttendanceRequestDto {

    @NotNull(message = "Ngày làm việc giải trình không được để trống")
    @Schema(description = "Ngày cần giải trình (YYYY-MM-DD)", example = "2026-11-15")
    private LocalDate workDate;

    @NotNull(message = "Loại lý do không được để trống")
    @Schema(description = "Loại lý do (FORGOT_PUNCH, TIME_DEVIATION, DEVICE_FAILURE, BUSINESS_TRIP, OTHER)", example = "FORGOT_PUNCH")
    private AttendanceRequestType requestType;

    @Schema(description = "Giờ vào đề xuất công nhận (ISO-8601)", example = "2026-11-15T08:00:00Z")
    private Instant proposedCheckIn;

    @Schema(description = "Giờ ra đề xuất công nhận (ISO-8601)", example = "2026-11-15T17:05:00Z")
    private Instant proposedCheckOut;

    @NotBlank(message = "Lý do giải trình không được để trống")
    @Schema(description = "Nội dung giải trình chi tiết", example = "Đi gặp khách hàng đột xuất đầu giờ sáng nên quên quẹt thẻ vào.")
    private String reason;

    @Schema(description = "ID file bằng chứng đính kèm (nếu có)")
    private UUID attachmentFileId;
}

