package com.cyclosa.notification.controller;

import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.notification.dto.request.InternalNotificationRequest;
import com.cyclosa.notification.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/internal/notifications")
@RequiredArgsConstructor
@Tag(name = "Internal Notifications", description = "API tạo thông báo giữa các module dịch vụ nội bộ")
public class InternalNotificationController {

    private final NotificationService notificationService;

    @PostMapping
    @Operation(summary = "Tạo thông báo nội bộ cho danh sách người dùng chỉ định")
    public ResponseEntity<ApiResponse<Map<String, Object>>> sendInternalNotification(
            @Valid @RequestBody InternalNotificationRequest request
    ) {
        int createdCount = notificationService.sendInternalNotification(request);
        return ResponseEntity.ok(ApiResponse.ok(
                Map.of("createdCount", createdCount),
                "Tạo thông báo nội bộ thành công"
        ));
    }
}

