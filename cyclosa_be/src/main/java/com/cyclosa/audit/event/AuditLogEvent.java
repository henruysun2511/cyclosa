package com.cyclosa.audit.event;

import com.cyclosa.audit.enums.AuditAction;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Domain Event lưu thông tin sự kiện kiểm toán hệ thống.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogEvent {

    private UUID actorUserId;
    private AuditAction action;
    private String entityType;
    private String entityId;
    @Builder.Default
    private LocalDateTime occurredAt = LocalDateTime.now();
    private String ipAddress;
    private String userAgent;
    private Object oldValue;
    private Object newValue;
    private String description;
}

