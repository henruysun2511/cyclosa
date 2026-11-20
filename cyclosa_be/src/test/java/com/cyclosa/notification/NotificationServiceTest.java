package com.cyclosa.notification;

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
import com.cyclosa.notification.service.NotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private UserService userService;

    @Mock
    private NotificationMapper notificationMapper;

    @InjectMocks
    private NotificationService notificationService;

    private UUID userId;
    private UUID notificationId;
    private Notification sampleNotification;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        notificationId = UUID.randomUUID();

        sampleNotification = Notification.builder()
                .userId(userId)
                .notificationType(NotificationType.WORKFLOW)
                .title("Đề xuất tuyển dụng mới")
                .content("Có đề xuất tuyển dụng đang chờ bạn duyệt")
                .actionUrl("/approvals?id=123")
                .readAt(null)
                .build();
        sampleNotification.setId(notificationId);
        sampleNotification.setCreatedAt(LocalDateTime.now());
    }

    @Test
    @DisplayName("getUnreadCount - Trả về số lượng thông báo chưa đọc chính xác")
    void getUnreadCount_success() {
        when(notificationRepository.countByUserIdAndReadAtIsNull(userId)).thenReturn(5L);

        UnreadCountResponse response = notificationService.getUnreadCount(userId);

        assertNotNull(response);
        assertEquals(5L, response.getUnreadCount());
        verify(notificationRepository, times(1)).countByUserIdAndReadAtIsNull(userId);
    }

    @Test
    @DisplayName("getMyNotifications - Phân trang danh sách thông báo của người dùng")
    void getMyNotifications_success() {
        NotificationFilterRequest filter = new NotificationFilterRequest();
        filter.setPage(0);
        filter.setSize(10);
        filter.setRead(false);
        filter.setType(NotificationType.WORKFLOW);

        Page<Notification> page = new PageImpl<>(List.of(sampleNotification));
        when(notificationRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(page);
        when(notificationMapper.toResponse(any(Notification.class)))
                .thenReturn(NotificationResponse.builder().title("Đề xuất tuyển dụng mới").isRead(false).build());

        PageData<NotificationResponse> result = notificationService.getMyNotifications(userId, filter);

        assertNotNull(result);
        assertEquals(1, result.getItems().size());
        assertEquals("Đề xuất tuyển dụng mới", result.getItems().get(0).getTitle());
        assertFalse(result.getItems().get(0).isRead());
    }

    @Test
    @DisplayName("markAsRead - Đánh dấu thông báo đã đọc thành công")
    void markAsRead_success() {
        when(notificationRepository.findByIdAndUserId(notificationId, userId))
                .thenReturn(Optional.of(sampleNotification));
        when(notificationRepository.save(any(Notification.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(notificationMapper.toResponse(any(Notification.class)))
                .thenReturn(NotificationResponse.builder().isRead(true).readAt(LocalDateTime.now()).build());

        NotificationResponse response = notificationService.markAsRead(userId, notificationId);

        assertNotNull(response);
        assertTrue(response.isRead());
        assertNotNull(response.getReadAt());
        verify(notificationRepository, times(1)).save(sampleNotification);
    }

    @Test
    @DisplayName("markAsRead - Ném lỗi NOTIFICATION_NOT_FOUND khi thông báo không tồn tại hoặc không thuộc quyền sở hữu")
    void markAsRead_notFound() {
        when(notificationRepository.findByIdAndUserId(notificationId, userId))
                .thenReturn(Optional.empty());

        AppException ex = assertThrows(AppException.class, () ->
                notificationService.markAsRead(userId, notificationId)
        );

        assertEquals(NotificationErrorCode.NOTIFICATION_NOT_FOUND, ex.getErrorCode());
    }

    @Test
    @DisplayName("markAllAsRead - Đánh dấu tất cả thông báo là đã đọc")
    void markAllAsRead_success() {
        when(notificationRepository.markAllAsRead(eq(userId), any(LocalDateTime.class)))
                .thenReturn(3);

        int updated = notificationService.markAllAsRead(userId);

        assertEquals(3, updated);
        verify(notificationRepository, times(1)).markAllAsRead(eq(userId), any(LocalDateTime.class));
    }

    @Test
    @DisplayName("deleteNotification - Xóa thông báo cá nhân thành công")
    void deleteNotification_success() {
        when(notificationRepository.findByIdAndUserId(notificationId, userId))
                .thenReturn(Optional.of(sampleNotification));

        notificationService.deleteNotification(userId, notificationId);

        verify(notificationRepository, times(1)).deleteByIdAndUserId(notificationId, userId);
    }

    @Test
    @DisplayName("deleteNotification - Ném lỗi NOTIFICATION_NOT_FOUND khi thông báo không thuộc quyền sở hữu")
    void deleteNotification_notFound() {
        when(notificationRepository.findByIdAndUserId(notificationId, userId))
                .thenReturn(Optional.empty());

        AppException ex = assertThrows(AppException.class, () ->
                notificationService.deleteNotification(userId, notificationId)
        );

        assertEquals(NotificationErrorCode.NOTIFICATION_NOT_FOUND, ex.getErrorCode());
        verify(notificationRepository, never()).deleteByIdAndUserId(any(), any());
    }

    @Test
    @DisplayName("broadcast - Phát thông báo toàn công ty (Fan-out thành công cho danh sách active users)")
    void broadcast_success() {
        UUID user1 = UUID.randomUUID();
        UUID user2 = UUID.randomUUID();
        when(userService.getActiveUserIds()).thenReturn(List.of(user1, user2));

        BroadcastNotificationRequest request = BroadcastNotificationRequest.builder()
                .title("Nghỉ lễ 30/4")
                .content("Thông báo lịch nghỉ lễ toàn công ty")
                .actionUrl("/announcements/holiday")
                .build();

        BroadcastResponse response = notificationService.broadcast(userId, request);

        assertNotNull(response);
        assertEquals(2, response.getRecipientsCount());
        assertNotNull(response.getBroadcastAt());
        verify(notificationRepository, times(1)).saveAll(anyList());
    }

    @Test
    @DisplayName("broadcast - Ném lỗi NOTIFICATION_BROADCAST_EMPTY_TARGET khi không có user nào active")
    void broadcast_emptyTarget() {
        when(userService.getActiveUserIds()).thenReturn(Collections.emptyList());

        BroadcastNotificationRequest request = BroadcastNotificationRequest.builder()
                .title("Thông báo chung")
                .content("Nội dung")
                .build();

        AppException ex = assertThrows(AppException.class, () ->
                notificationService.broadcast(userId, request)
        );

        assertEquals(NotificationErrorCode.NOTIFICATION_BROADCAST_EMPTY_TARGET, ex.getErrorCode());
        verify(notificationRepository, never()).saveAll(anyList());
    }

    @Test
    @DisplayName("sendInternalNotification - Tạo thông báo nội bộ thành công")
    void sendInternalNotification_success() {
        InternalNotificationRequest request = InternalNotificationRequest.builder()
                .userIds(List.of(UUID.randomUUID(), UUID.randomUUID()))
                .notificationType(NotificationType.CONTRACT)
                .title("Hợp đồng sắp hết hạn")
                .content("Hợp đồng của bạn sắp hết hạn sau 15 ngày")
                .actionUrl("/contracts/1")
                .build();

        int count = notificationService.sendInternalNotification(request);

        assertEquals(2, count);
        verify(notificationRepository, times(1)).saveAll(anyList());
    }
}
