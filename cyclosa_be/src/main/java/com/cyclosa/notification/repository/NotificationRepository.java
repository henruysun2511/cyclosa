package com.cyclosa.notification.repository;

import com.cyclosa.notification.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID>, JpaSpecificationExecutor<Notification> {

    /**
     * Đếm số lượng thông báo chưa đọc của người dùng (tận dụng index idx_notifications_user_unread)
     */
    long countByUserIdAndReadAtIsNull(UUID userId);

    /**
     * Tìm thông báo theo ID và thuộc quyền sở hữu của người dùng (Bảo vệ tính riêng tư)
     */
    Optional<Notification> findByIdAndUserId(UUID id, UUID userId);

    /**
     * Xóa thông báo khỏi hộp thư cá nhân
     */
    void deleteByIdAndUserId(UUID id, UUID userId);

    /**
     * Đánh dấu toàn bộ thông báo của người dùng là đã đọc chỉ với 1 câu lệnh SQL duy nhất
     */
    @Modifying
    @Query("UPDATE Notification n SET n.readAt = :readAt WHERE n.userId = :userId AND n.readAt IS NULL")
    int markAllAsRead(@Param("userId") UUID userId, @Param("readAt") LocalDateTime readAt);
}

