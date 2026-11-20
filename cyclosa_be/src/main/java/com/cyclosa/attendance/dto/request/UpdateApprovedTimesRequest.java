package com.cyclosa.attendance.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Schema(description = "Yêu cầu hiệu chỉnh giờ công nhận khi phê duyệt giải trình")
public class UpdateApprovedTimesRequest {

    @Schema(description = "Giờ vào chính thức được chấp nhận (ISO-8601)", example = "2026-11-15T08:00:00Z")
    private Instant approvedCheckIn;

    @Schema(description = "Giờ ra chính thức được chấp nhận (ISO-8601)", example = "2026-11-15T17:00:00Z")
    private Instant approvedCheckOut;

    @Schema(description = "Ghi chú của người duyệt", example = "Chấp thuận công nhận theo email xác nhận của khách hàng.")
    private String reviewerNotes;
}

