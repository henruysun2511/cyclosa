package com.cyclosa.notification.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Yêu cầu phát thông báo toàn công ty")
public class BroadcastNotificationRequest {

    @NotBlank(message = "Tiêu đề thông báo không được để trống")
    @Size(max = 200, message = "Tiêu đề thông báo tối đa 200 ký tự")
    @Schema(description = "Tiêu đề thông báo", example = "Thông báo nghỉ Tết Dương lịch 2027")
    private String title;

    @NotBlank(message = "Nội dung thông báo không được để trống")
    @Schema(description = "Nội dung chi tiết thông báo", example = "Toàn thể CBNV công ty sẽ được nghỉ Tết Dương lịch vào ngày 01/01/2027.")
    private String content;

    @Size(max = 500, message = "Đường dẫn liên kết tối đa 500 ký tự")
    @Schema(description = "Đường dẫn tới màn hình nghiệp vụ đích (nếu có)", example = "/announcements/tet-2027")
    private String actionUrl;
}

