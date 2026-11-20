package com.cyclosa.notification.listener;

import com.cyclosa.notification.dto.request.InternalNotificationRequest;
import com.cyclosa.notification.event.SendNotificationEvent;
import com.cyclosa.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

/**
 * Lắng nghe các sự kiện phát sinh thông báo từ các phân hệ nghiệp vụ khác
 * Chạy bất đồng bộ (@Async) sau khi giao dịch nghiệp vụ chính đã commit thành công
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class NotificationEventListener {

    private final NotificationService notificationService;

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, fallbackExecution = true)
    public void handleSendNotificationEvent(SendNotificationEvent event) {
        if (event.targetUserIds() == null || event.targetUserIds().isEmpty()) {
            return;
        }

        log.debug("Nhận sự kiện SendNotificationEvent: type={}, số lượng người nhận={}",
                event.notificationType(), event.targetUserIds().size());

        InternalNotificationRequest request = InternalNotificationRequest.builder()
                .userIds(event.targetUserIds())
                .notificationType(event.notificationType())
                .title(event.title())
                .content(event.content())
                .actionUrl(event.actionUrl())
                .build();

        notificationService.sendInternalNotification(request);
    }
}

