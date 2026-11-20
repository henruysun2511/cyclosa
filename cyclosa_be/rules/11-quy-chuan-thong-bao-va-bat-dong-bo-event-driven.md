# Quy chuẩn 11: Thông Báo & Xử Lý Bất Đồng Bộ (Event-Driven Notifications)

> **Áp dụng cho:** Tất cả các module và lập trình viên / AI Agent khi phát triển trong `cyclosa_be`.

---

## 1. Nguyên Tắc Cốt Lõi: Event-Driven Decoupling

Trong hệ thống CYCLOSA HRM, mọi hành động phát sinh cần thông báo tới người dùng (ví dụ: có ca làm việc mới, đơn nghỉ phép đã được duyệt, sắp hết hạn hợp đồng, lịch phỏng vấn tuyển dụng...) **BẮT BUỘC** phải tuân thủ nguyên tắc:

1. **Decoupling (Tách biệt ranh giới module):**
   - Module nghiệp vụ (Attendance, Leave, Contract, Recruitment...) **TUYỆT ĐỐI KHÔNG** inject `NotificationRepository` để tự insert vào bảng thông báo.
   - **CHỈ ĐƯỢC PHÉP** bắn sự kiện chuẩn: `com.cyclosa.notification.event.SendNotificationEvent` qua Spring `ApplicationEventPublisher`.
2. **Non-blocking & Resilience (Không chặn luồng chính):**
   - Việc tạo thông báo, gửi Web Push, gửi Email hoặc Socket **phải diễn ra bất đồng bộ (`@Async` hoặc RabbitMQ)**.
   - Nếu hệ thống thông báo gặp sự cố (ví dụ lỗi mạng, lỗi mail server), **tuyệt đối không được gây lỗi hoặc rollback transaction nghiệp vụ chính của người dùng**.

---

## 2. Cấu Trúc Sự Kiện `SendNotificationEvent`

Sự kiện được đóng gói dạng Java Record bất biến trong package `com.cyclosa.notification.event`:

```java
package com.cyclosa.notification.event;

import com.cyclosa.notification.enums.NotificationType;
import lombok.Builder;

import java.util.List;
import java.util.UUID;

@Builder
public record SendNotificationEvent(
    List<UUID> targetUserIds,           // Danh sách ID tài khoản (users.id) nhận thông báo
    NotificationType notificationType,  // Phân loại nghiệp vụ (ATTENDANCE, LEAVE, CONTRACT, RECRUITMENT...)
    String title,                       // Tiêu đề thông báo ngắn gọn, rõ ràng
    String content,                     // Nội dung thông báo chi tiết
    String actionUrl                    // Đường dẫn điều hướng tại Frontend khi click (vd: /attendance/requests)
) {
    // Tiện ích gửi thông báo cho 1 người nhận duy nhất
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
```

---

## 3. Danh Mục Phân Loại `NotificationType`

```java
public enum NotificationType {
    SYSTEM,         // Thông báo hệ thống, bảo trì
    LEAVE,          // Nghỉ phép (gửi đơn, phê duyệt, từ chối, hết phép)
    ATTENDANCE,     // Chấm công (phân ca, duyệt giải trình, khóa/mở khóa kỳ công)
    CONTRACT,       // Hợp đồng (sắp hết hạn, ký mới, gia hạn)
    RECRUITMENT,    // Tuyển dụng (lịch phỏng vấn, kết quả duyệt offer)
    ONBOARDING,     // Hội nhập nhân sự mới (giao việc, hoàn thành thủ tục)
    PAYROLL         // Bảng lương (công bố phiếu lương, chuyển khoản)
}
```

---

## 4. Hướng Dẫn Bắn Sự Kiện Trong Service Nghiệp Vụ

### 4.1. Khai báo `ApplicationEventPublisher`
Trong Service của module nghiệp vụ, inject `ApplicationEventPublisher`:
```java
@Slf4j
@Service
@RequiredArgsConstructor
public class AttendanceRequestService {

    private final AttendanceRequestRepository attendanceRequestRepository;
    private final ApplicationEventPublisher eventPublisher;
    
    // ...
}
```

### 4.2. Gửi thông báo cho cá nhân (1 người nhận)
Ví dụ khi đơn giải trình chấm công được duyệt hoặc từ chối:
```java
@Transactional
public AttendanceRequestResponse updateApprovedTimesAndApprove(UUID id, UpdateApprovedTimesRequest body) {
    // 1. Thực hiện phê duyệt & lưu vào CSDL
    request.setStatus(AttendanceRequestStatus.APPROVED);
    AttendanceRequest saved = attendanceRequestRepository.save(request);

    // 2. Bắn sự kiện gửi thông báo cho nhân viên làm đơn
    UUID targetUserId = employee.getUserId();
    if (targetUserId != null) {
        eventPublisher.publishEvent(SendNotificationEvent.ofSingle(
                targetUserId,
                NotificationType.ATTENDANCE,
                "Đơn giải trình chấm công đã được duyệt",
                "Đơn giải trình ngày " + saved.getWorkDate() + " của bạn đã được quản lý phê duyệt.",
                "/attendance/requests"
        ));
    }

    return response;
}
```

### 4.3. Gửi thông báo cho danh sách nhiều người nhận (`targetUserIds`)
Ví dụ khi phân ca làm việc mới cho nhóm nhân viên:
```java
@Transactional
public List<ShiftAssignmentResponse> assignShifts(BulkShiftAssignmentRequest req) {
    // 1. Lưu danh sách phân ca
    List<ShiftAssignment> savedAssignments = shiftAssignmentRepository.saveAll(assignments);

    // 2. Tập hợp danh sách userId của các nhân viên được phân ca
    List<UUID> targetUserIds = employees.stream()
            .map(Employee::getUserId)
            .filter(Objects::nonNull)
            .distinct()
            .toList();

    // 3. Bắn 1 sự kiện duy nhất gửi tới toàn bộ nhân viên liên quan
    if (!targetUserIds.isEmpty()) {
        eventPublisher.publishEvent(SendNotificationEvent.builder()
                .targetUserIds(targetUserIds)
                .notificationType(NotificationType.ATTENDANCE)
                .title("Lịch làm việc ca mới")
                .content("Bạn đã được phân ca làm việc mới: " + shift.getName() + " từ ngày " + req.getStartDate())
                .actionUrl("/attendance/my-schedule")
                .build());
    }

    return responses;
}
```

---

## 5. Quy Chuẩn Xử Lý Tại Module `notification` (Consumer)

Phía module `notification`, `NotificationEventListener` tiếp nhận sự kiện:

```java
@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationEventListener {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate; // WebSocket (nếu có)

    @Async("notificationTaskExecutor") // Chạy bất đồng bộ trên luồng riêng
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT) // Chỉ chạy sau khi Transaction gốc commit thành công
    public void handleSendNotification(SendNotificationEvent event) {
        try {
            List<Notification> notifications = event.targetUserIds().stream()
                    .map(userId -> Notification.builder()
                            .userId(userId)
                            .type(event.notificationType())
                            .title(event.title())
                            .content(event.content())
                            .actionUrl(event.actionUrl())
                            .isRead(false)
                            .build())
                    .toList();

            notificationRepository.saveAll(notifications);
            
            // Đẩy thông báo thời gian thực qua WebSocket (nếu online)
            // ...
        } catch (Exception ex) {
            log.error("Lỗi khi xử lý lưu thông báo bất đồng bộ: {}", ex.getMessage(), ex);
        }
    }
}
```

### Điểm kỹ thuật quan trọng bắt buộc:
1. `@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)`: Đảm bảo chỉ gửi thông báo khi và chỉ khi dữ liệu nghiệp vụ của đơn từ/ca làm việc đã được lưu vĩnh viễn vào CSDL. Tránh tình trạng nhân viên nhận thông báo "Đã duyệt" nhưng giao dịch CSDL lại bị lỗi rollback.
2. `@Async`: Xử lý trên thread pool riêng biệt `notificationTaskExecutor`, giúp API phản hồi cho người dùng ngay lập tức mà không phải chờ quá trình lưu thông báo và gửi socket/email.

