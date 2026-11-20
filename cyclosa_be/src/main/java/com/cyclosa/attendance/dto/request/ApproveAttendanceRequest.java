package com.cyclosa.attendance.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "Yêu cầu phê duyệt giải trình chấm công kèm giờ công nhận")
public class ApproveAttendanceRequest extends UpdateApprovedTimesRequest {
}

