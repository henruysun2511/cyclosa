package com.cyclosa.notification.dto.request;

import com.cyclosa.notification.enums.NotificationType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Yêu cầu tạo thông báo nội bộ giữa các module")
public class InternalNotificationRequest {

    @NotEmpty(message = "Danh sách người nhận không được để trống")
    @Schema(description = "Danh sách ID người dùng nhận thông báo")
    private List<UUID> userIds;

    @NotNull(message = "Loại thông báo không được để trống")
    @Schema(description = "Loại thông báo", example = "WORKFLOW")
    private NotificationType notificationType;

    @NotBlank(message = "Tiêu đề thông báo không được để trống")
    @Size(max = 200, message = "Tiêu đề thông báo tối đa 200 ký tự")
    @Schema(description = "Tiêu đề thông báo", example = "Phiếu phê duyệt hợp đồng mới")
    private String title;

    @NotBlank(message = "Nội dung thông báo không được để trống")
    @Schema(description = "Nội dung thông báo", example = "Hợp đồng lao động HĐLĐ-2026-089 đang chờ bạn xét duyệt.")
    private String content;

    @Size(max = 500, message = "Đường dẫn liên kết tối đa 500 ký tự")
    @Schema(description = "Đường dẫn màn hình nghiệp vụ liên quan", example = "/approvals?requestId=102")
    private String actionUrl;
}

