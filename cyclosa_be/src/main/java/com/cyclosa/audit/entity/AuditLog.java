package com.cyclosa.audit.entity;

import com.cyclosa.audit.enums.AuditAction;
import com.cyclosa.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Thực thể Nhật ký kiểm toán — Hộp đen bất biến (Append-Only Ledger)
 * Tuyệt đối không cập nhật hoặc xóa vật lý/xóa mềm.
 */
@Entity
@Table(name = "audit_logs", indexes = {
        @Index(name = "idx_audit_entity_trail", columnList = "entity_type, entity_id, occurred_at"),
        @Index(name = "idx_audit_actor_time", columnList = "actor_user_id, occurred_at"),
        @Index(name = "idx_audit_action_time", columnList = "action, occurred_at"),
        @Index(name = "idx_audit_occurred_time", columnList = "occurred_at")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog extends BaseEntity {

    @Column(name = "actor_user_id")
    private UUID actorUserId;

    @Enumerated(EnumType.STRING)
    @Column(name = "action", nullable = false, length = 30)
    private AuditAction action;

    @Column(name = "entity_type", nullable = false, length = 100)
    private String entityType;

    @Column(name = "entity_id", nullable = false, length = 100)
    private String entityId;

    @Column(name = "occurred_at", nullable = false)
    @Builder.Default
    private LocalDateTime occurredAt = LocalDateTime.now();

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "user_agent", length = 500)
    private String userAgent;

    @Column(name = "old_value", columnDefinition = "TEXT")
    private String oldValue;

    @Column(name = "new_value", columnDefinition = "TEXT")
    private String newValue;

    @Column(name = "description", length = 500)
    private String description;
}

