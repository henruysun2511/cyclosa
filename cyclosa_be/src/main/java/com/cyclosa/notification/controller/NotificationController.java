package com.cyclosa.notification.controller;

import com.cyclosa.common.annotation.RequirePermission;
import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.common.response.PageData;
import com.cyclosa.common.util.SecurityUtils;
import com.cyclosa.notification.dto.request.BroadcastNotificationRequest;
import com.cyclosa.notification.dto.request.NotificationFilterRequest;
import com.cyclosa.notification.dto.response.BroadcastResponse;
import com.cyclosa.notification.dto.response.NotificationResponse;
import com.cyclosa.notification.dto.response.UnreadCountResponse;
import com.cyclosa.notification.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
@Tag(name = "Notifications", description = "Hộp thư thông báo cá nhân và phát thông báo toàn hệ thống")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Lấy danh sách thông báo của tôi (phân trang, lọc theo trạng thái đọc và loại)")
    public ResponseEntity<ApiResponse<PageData<NotificationResponse>>> getMyNotifications(
            @Valid @ParameterObject NotificationFilterRequest filter
    ) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        PageData<NotificationResponse> result = notificationService.getMyNotifications(currentUserId, filter);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách thông báo thành công"));
    }

    @GetMapping("/unread-count")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Lấy số lượng thông báo chưa đọc cho biểu tượng quả chuông trên Header")
    public ResponseEntity<ApiResponse<UnreadCountResponse>> getUnreadCount() {
        UUID currentUserId = SecurityUtils.getCurrentUserIdOptional().orElse(null);
        UnreadCountResponse result = notificationService.getUnreadCount(currentUserId);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy số lượng thông báo chưa đọc thành công"));
    }

    @PostMapping("/{notificationId}/read")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Đánh dấu một thông báo cụ thể là đã đọc")
    public ResponseEntity<ApiResponse<NotificationResponse>> markAsRead(
            @PathVariable UUID notificationId
    ) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        NotificationResponse result = notificationService.markAsRead(currentUserId, notificationId);
        return ResponseEntity.ok(ApiResponse.ok(result, "Đã đánh dấu thông báo là đã đọc"));
    }

    @PostMapping("/read-all")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Đánh dấu tất cả thông báo của tôi là đã đọc")
    public ResponseEntity<ApiResponse<Map<String, Object>>> markAllAsRead() {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        int updated = notificationService.markAllAsRead(currentUserId);
        return ResponseEntity.ok(ApiResponse.ok(Map.of("updatedCount", updated), "Đã đánh dấu tất cả thông báo là đã đọc"));
    }

    @DeleteMapping("/{notificationId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Xóa một thông báo khỏi hộp thư cá nhân")
    public ResponseEntity<ApiResponse<Void>> deleteNotification(
            @PathVariable UUID notificationId
    ) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        notificationService.deleteNotification(currentUserId, notificationId);
        return ResponseEntity.ok(ApiResponse.ok(null, "Đã xóa thông báo thành công"));
    }

    @PostMapping("/broadcast")
    @PreAuthorize("@perm.has('notification.broadcast') or hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    @RequirePermission(code = "notification.broadcast")
    @Operation(summary = "Phát thông báo toàn công ty (Fan-out mỗi người một dòng)")
    public ResponseEntity<ApiResponse<BroadcastResponse>> broadcast(
            @Valid @RequestBody BroadcastNotificationRequest request
    ) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        BroadcastResponse result = notificationService.broadcast(currentUserId, request);
        return ResponseEntity.ok(ApiResponse.ok(result, "Phát thông báo toàn công ty thành công"));
    }
}
