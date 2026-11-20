package com.cyclosa.notification.event;

import com.cyclosa.notification.enums.NotificationType;
import lombok.Builder;

import java.util.List;
import java.util.UUID;

/**
 * Sự kiện Spring ApplicationEvent dùng để gửi thông báo bất đồng bộ giữa các module
 */
@Builder
public record SendNotificationEvent(
        List<UUID> targetUserIds,
        NotificationType notificationType,
        String title,
        String content,
        String actionUrl
) {
    public static SendNotificationEvent ofSingle(
            UUID targetUserId,
            NotificationType notificationType,
            String title,
            String content,
            String actionUrl
    ) {
        return new SendNotificationEvent(
                List.of(targetUserId),
                notificationType,
                title,
                content,
                actionUrl
        );
    }
}

