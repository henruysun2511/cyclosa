package com.cyclosa.reward.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "Yêu cầu ghi nhận phương án giải quyết khiếu nại")
public class ResolveComplaintRequest {

    @NotBlank(message = "Phương án giải quyết không được để trống")
    @Schema(description = "Kết luận và phương án giải quyết của phòng Nhân sự", example = "Đã rà soát lại log chấm công và đồng ý cộng thêm 2 giờ OT vào kỳ lương tháng 11")
    private String resolution;
}

