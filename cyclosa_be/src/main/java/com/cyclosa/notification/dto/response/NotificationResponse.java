package com.cyclosa.notification.dto.response;

import com.cyclosa.notification.entity.Notification;
import com.cyclosa.notification.enums.NotificationType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Thông tin chi tiết một bản ghi thông báo")
public class NotificationResponse {

    @Schema(description = "ID thông báo")
    private UUID id;

    @Schema(description = "Phân loại thông báo")
    private NotificationType notificationType;

    @Schema(description = "Tiêu đề thông báo")
    private String title;

    @Schema(description = "Nội dung chi tiết thông báo")
    private String content;

    @Schema(description = "Đường dẫn màn hình nghiệp vụ đích")
    private String actionUrl;

    @Schema(description = "Thời điểm phát hành")
    private LocalDateTime createdAt;

    @Schema(description = "Thời điểm đọc (null nếu chưa đọc)")
    private LocalDateTime readAt;

    @com.fasterxml.jackson.annotation.JsonProperty("isRead")
    @Schema(description = "Trạng thái đọc suy diễn (readAt != null)")
    private boolean isRead;

    public static NotificationResponse from(Notification n) {
        if (n == null) {
            return null;
        }
        return NotificationResponse.builder()
                .id(n.getId())
                .notificationType(n.getNotificationType())
                .title(n.getTitle())
                .content(n.getContent())
                .actionUrl(n.getActionUrl())
                .createdAt(n.getCreatedAt())
                .readAt(n.getReadAt())
                .isRead(n.isRead())
                .build();
    }
}

