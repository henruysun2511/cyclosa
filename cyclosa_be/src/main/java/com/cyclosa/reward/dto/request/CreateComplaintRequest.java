package com.cyclosa.reward.dto.request;

import com.cyclosa.reward.enums.ComplaintCategory;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "Yêu cầu gửi khiếu nại hoặc phản ánh nội bộ")
public class CreateComplaintRequest {

    @NotNull(message = "Nhóm khiếu nại không được để trống")
    @Schema(description = "Nhóm khiếu nại (WORKPLACE_CONFLICT, COMPENSATION, POLICY, HARASSMENT, OTHER)")
    private ComplaintCategory category;

    @NotBlank(message = "Tiêu đề không được để trống")
    @Size(max = 200, message = "Tiêu đề tối đa 200 ký tự")
    @Schema(description = "Tiêu đề ngắn gọn phản ánh", example = "Khiếu nại về tính sai giờ làm thêm ngày 15/10")
    private String subject;

    @NotBlank(message = "Nội dung phản ánh không được để trống")
    @Schema(description = "Nội dung chi tiết khiếu nại")
    private String content;
}

