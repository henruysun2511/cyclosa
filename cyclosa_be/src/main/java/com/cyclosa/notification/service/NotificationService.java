package com.cyclosa.notification.service;

import com.cyclosa.audit.aop.Auditable;
import com.cyclosa.audit.enums.AuditAction;
import com.cyclosa.auth.service.UserService;
import com.cyclosa.common.exception.AppException;
import com.cyclosa.common.response.PageData;
import com.cyclosa.notification.dto.request.BroadcastNotificationRequest;
import com.cyclosa.notification.dto.request.InternalNotificationRequest;
import com.cyclosa.notification.dto.request.NotificationFilterRequest;
import com.cyclosa.notification.dto.response.BroadcastResponse;
import com.cyclosa.notification.dto.response.NotificationResponse;
import com.cyclosa.notification.dto.response.UnreadCountResponse;
import com.cyclosa.notification.entity.Notification;
import com.cyclosa.notification.enums.NotificationType;
import com.cyclosa.notification.exception.NotificationErrorCode;
import com.cyclosa.notification.mapper.NotificationMapper;
import com.cyclosa.notification.repository.NotificationRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserService userService; // Tuân thủ nguyên tắc: chỉ gọi Service ngoại, cấm inject foreign repository
    private final NotificationMapper notificationMapper; // MapStruct Mapper theo chuẩn §8.2

    private static final int BATCH_SIZE = 500;
    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of("createdAt", "readAt", "title");

    /**
     * Lấy số lượng thông báo chưa đọc của người dùng hiện tại
     */
    @Transactional(readOnly = true)
    public UnreadCountResponse getUnreadCount(UUID currentUserId) {
        if (currentUserId == null) {
            return UnreadCountResponse.builder().unreadCount(0L).build();
        }
        long count = notificationRepository.countByUserIdAndReadAtIsNull(currentUserId);
        return UnreadCountResponse.builder().unreadCount(count).build();
    }

    /**
     * Lấy danh sách thông báo cá nhân hóa (phân trang chuẩn BaseFilterRequest, lọc theo trạng thái đọc và phân loại)
     */
    @Transactional(readOnly = true)
    public PageData<NotificationResponse> getMyNotifications(UUID currentUserId, NotificationFilterRequest filter) {
        Pageable pageable = filter.toPageable("createdAt", ALLOWED_SORT_FIELDS);

        Specification<Notification> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Luôn luôn bắt buộc giới hạn theo người dùng hiện tại
            predicates.add(cb.equal(root.get("userId"), currentUserId));

            // Lọc theo trạng thái đọc nếu có
            if (filter.getRead() != null) {
                if (filter.getRead()) {
                    predicates.add(cb.isNotNull(root.get("readAt")));
                } else {
                    predicates.add(cb.isNull(root.get("readAt")));
                }
            }

            // Lọc theo phân loại nếu có
            if (filter.getType() != null) {
                predicates.add(cb.equal(root.get("notificationType"), filter.getType()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Notification> notificationPage = notificationRepository.findAll(spec, pageable);
        return PageData.of(notificationPage, notificationMapper::toResponse);
    }

    /**
     * Đánh dấu một thông báo cụ thể là đã đọc
     */
    @Transactional
    public NotificationResponse markAsRead(UUID currentUserId, UUID notificationId) {
        Notification notification = notificationRepository.findByIdAndUserId(notificationId, currentUserId)
                .orElseThrow(() -> new AppException(NotificationErrorCode.NOTIFICATION_NOT_FOUND));

        notification.markAsRead();
        Notification saved = notificationRepository.save(notification);
        log.debug("Người dùng {} đã đọc thông báo {}", currentUserId, notificationId);
        return notificationMapper.toResponse(saved);
    }

    /**
     * Đánh dấu toàn bộ thông báo của người dùng là đã đọc
     */
    @Transactional
    public int markAllAsRead(UUID currentUserId) {
        int updated = notificationRepository.markAllAsRead(currentUserId, LocalDateTime.now());
        log.info("Người dùng {} đã đánh dấu đọc tất cả {} thông báo", currentUserId, updated);
        return updated;
    }

    /**
     * Xóa một thông báo khỏi hòm thư cá nhân (Xóa vật lý)
     */
    @Transactional
    @Auditable(action = AuditAction.DELETE, entityType = "NOTIFICATION", entityIdExpression = "#notificationId", description = "Xóa thông báo cá nhân")
    public void deleteNotification(UUID currentUserId, UUID notificationId) {
        Notification notification = notificationRepository.findByIdAndUserId(notificationId, currentUserId)
                .orElseThrow(() -> new AppException(NotificationErrorCode.NOTIFICATION_NOT_FOUND));

        notificationRepository.deleteByIdAndUserId(notification.getId(), currentUserId);
        log.info("Người dùng {} đã xóa thông báo {}", currentUserId, notificationId);
    }

    /**
     * Phát thông báo toàn công ty (Fan-out mỗi người dùng một bản ghi riêng)
     */
    @Transactional
    @Auditable(action = AuditAction.PUBLISH, entityType = "NOTIFICATION", description = "Phát thông báo toàn hệ thống")
    public BroadcastResponse broadcast(UUID currentUserId, BroadcastNotificationRequest request) {
        log.info("Bắt đầu phát sóng thông báo toàn hệ thống: title='{}', actor={}", request.getTitle(), currentUserId);

        List<UUID> activeUserIds = userService.getActiveUserIds();
        if (activeUserIds == null || activeUserIds.isEmpty()) {
            throw new AppException(NotificationErrorCode.NOTIFICATION_BROADCAST_EMPTY_TARGET);
        }

        List<Notification> batch = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        for (UUID targetUserId : activeUserIds) {
            Notification notification = Notification.builder()
                    .userId(targetUserId)
                    .notificationType(NotificationType.ANNOUNCEMENT)
                    .title(request.getTitle())
                    .content(request.getContent())
                    .actionUrl(request.getActionUrl())
                    .readAt(null)
                    .build();
            notification.setCreatedAt(now);

            batch.add(notification);

            if (batch.size() >= BATCH_SIZE) {
                notificationRepository.saveAll(batch);
                batch.clear();
            }
        }

        if (!batch.isEmpty()) {
            notificationRepository.saveAll(batch);
        }

        log.info("Đã phát tán thành công thông báo tới {} nhân sự", activeUserIds.size());
        return BroadcastResponse.builder()
                .recipientsCount(activeUserIds.size())
                .broadcastAt(now)
                .build();
    }

    /**
     * Gửi thông báo nội bộ cho danh sách người dùng chỉ định
     */
    @Transactional
    public int sendInternalNotification(InternalNotificationRequest request) {
        if (request.getUserIds() == null || request.getUserIds().isEmpty()) {
            return 0;
        }

        List<Notification> notifications = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        for (UUID targetUserId : request.getUserIds()) {
            Notification notification = Notification.builder()
                    .userId(targetUserId)
                    .notificationType(request.getNotificationType())
                    .title(request.getTitle())
                    .content(request.getContent())
                    .actionUrl(request.getActionUrl())
                    .readAt(null)
                    .build();
            notification.setCreatedAt(now);
            notifications.add(notification);
        }

        notificationRepository.saveAll(notifications);
        log.debug("Đã gửi {} thông báo nội bộ loại {}", notifications.size(), request.getNotificationType());
        return notifications.size();
    }
}
