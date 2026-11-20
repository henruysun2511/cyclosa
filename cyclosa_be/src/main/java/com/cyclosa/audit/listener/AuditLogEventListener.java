package com.cyclosa.audit.listener;

import com.cyclosa.audit.event.AuditLogEvent;
import com.cyclosa.audit.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

/**
 * Listener tiếp nhận sự kiện kiểm toán sau khi giao dịch chính đã commit thành công.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AuditLogEventListener {

    private final AuditLogService auditLogService;

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, fallbackExecution = true)
    public void onAuditLogEvent(AuditLogEvent event) {
        try {
            auditLogService.recordLog(event);
        } catch (Exception e) {
            log.error("Lỗi khi ghi nhận nhật ký kiểm toán bất đồng bộ: {}", e.getMessage(), e);
        }
    }
}

