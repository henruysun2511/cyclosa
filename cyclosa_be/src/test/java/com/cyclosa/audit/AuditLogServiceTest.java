package com.cyclosa.audit;

import com.cyclosa.audit.dto.request.AuditLogFilterRequest;
import com.cyclosa.audit.dto.response.*;
import com.cyclosa.audit.entity.AuditLog;
import com.cyclosa.audit.enums.AuditAction;
import com.cyclosa.audit.event.AuditLogEvent;
import com.cyclosa.audit.mapper.AuditLogMapper;
import com.cyclosa.audit.repository.AuditLogRepository;
import com.cyclosa.audit.service.AuditLogService;
import com.cyclosa.auth.service.UserService;
import com.cyclosa.common.response.PageData;
import com.cyclosa.employee.service.EmployeeService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuditLogServiceTest {

    @Mock
    private AuditLogRepository auditLogRepository;

    @Mock
    private AuditLogMapper auditLogMapper;

    @Mock
    private UserService userService;

    @Mock
    private EmployeeService employeeService;

    private AuditLogService auditLogService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        auditLogService = new AuditLogService(
                auditLogRepository,
                auditLogMapper,
                userService,
                employeeService,
                objectMapper
        );
    }

    @Test
    @DisplayName("Ghi nhận audit log thành công qua recordLog")
    void testRecordLogSuccess() {
        UUID actorId = UUID.randomUUID();
        AuditLogEvent event = AuditLogEvent.builder()
                .actorUserId(actorId)
                .action(AuditAction.UPDATE)
                .entityType("CONTRACT")
                .entityId("741")
                .ipAddress("127.0.0.1")
                .userAgent("Mozilla/5.0")
                .oldValue(Map.of("baseSalary", 10000000))
                .newValue(Map.of("baseSalary", 15000000))
                .description("Cập nhật lương")
                .build();

        AuditLog saved = AuditLog.builder()
                .actorUserId(actorId)
                .action(AuditAction.UPDATE)
                .entityType("CONTRACT")
                .entityId("741")
                .build();

        when(auditLogRepository.save(any(AuditLog.class))).thenReturn(saved);

        AuditLog result = auditLogService.recordLog(event);

        assertThat(result).isNotNull();
        assertThat(result.getEntityId()).isEqualTo("741");
        verify(auditLogRepository, times(1)).save(any(AuditLog.class));
    }

    @Test
    @DisplayName("Lấy danh mục 13 hành động chuẩn hóa")
    void testGetActionDefinitions() {
        List<AuditActionDefinitionResponse> actions = auditLogService.getActionDefinitions();

        assertThat(actions).hasSize(13);
        assertThat(actions).extracting("code")
                .contains("CREATE", "UPDATE", "DELETE", "APPROVE", "REJECT", "OVERRIDE", "EXPORT", "VIEW", "DOWNLOAD", "LOGIN", "LOCK", "UNLOCK", "PUBLISH");
    }

    @Test
    @DisplayName("Lấy lịch sử truy vết Audit Trail của thực thể theo thời gian tăng dần")
    void testGetEntityAuditTrail() {
        AuditLog log1 = AuditLog.builder()
                .action(AuditAction.CREATE)
                .entityType("CONTRACT")
                .entityId("741")
                .occurredAt(LocalDateTime.now().minusDays(2))
                .description("Tạo hợp đồng")
                .build();
        log1.setId(UUID.randomUUID());

        when(auditLogRepository.findByEntityTypeIgnoreCaseAndEntityIdOrderByOccurredAtAsc("CONTRACT", "741"))
                .thenReturn(List.of(log1));

        AuditTrailEventResponse eventResp = AuditTrailEventResponse.builder()
                .logId(log1.getId())
                .action(AuditAction.CREATE)
                .description("Tạo hợp đồng")
                .build();

        when(auditLogMapper.toTimelineEvent(log1)).thenReturn(eventResp);

        AuditTrailTimelineResponse timeline = auditLogService.getEntityAuditTrail("CONTRACT", "741");

        assertThat(timeline).isNotNull();
        assertThat(timeline.getTotalEvents()).isEqualTo(1);
        assertThat(timeline.getTimeline()).hasSize(1);
        assertThat(timeline.getTimeline().get(0).getActorName()).isEqualTo("Hệ thống tự động");
    }

    @Test
    @DisplayName("Xuất báo cáo nhật ký kiểm toán và tự động ghi audit log EXPORT")
    void testExportLogs() {
        AuditLogFilterRequest filter = new AuditLogFilterRequest();
        UUID currentUserId = UUID.randomUUID();

        when(auditLogRepository.count(any(Specification.class))).thenReturn(50L);

        AuditExportResponse resp = auditLogService.exportLogs(filter, currentUserId, "127.0.0.1", "TestAgent");

        assertThat(resp).isNotNull();
        assertThat(resp.getEstimatedRecords()).isEqualTo(50L);
        assertThat(resp.getStatus()).isEqualTo("COMPLETED");

        // Xác nhận cơ chế Auditing the Auditor: đã gọi save bản ghi EXPORT
        verify(auditLogRepository, times(1)).save(any(AuditLog.class));
    }
}
