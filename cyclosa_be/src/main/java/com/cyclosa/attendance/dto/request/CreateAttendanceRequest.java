package com.cyclosa.attendance.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "Yêu cầu gửi đơn giải trình chấm công")
public class CreateAttendanceRequest extends CreateAttendanceRequestDto {
}

