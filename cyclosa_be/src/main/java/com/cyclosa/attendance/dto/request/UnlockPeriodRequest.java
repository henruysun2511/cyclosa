package com.cyclosa.attendance.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "Yêu cầu mở khóa kỳ công tháng có kiểm soát")
public class UnlockPeriodRequest {

    @NotBlank(message = "Bắt buộc phải nhập lý do giải trình khi mở khóa kỳ công")
    @Schema(description = "Lý do mở khóa kỳ công", example = "Bổ sung quyết định cử đi công tác nước ngoài của phòng R&D.")
    private String reason;
}

