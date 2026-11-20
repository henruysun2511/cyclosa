package com.cyclosa.audit.service;

import com.cyclosa.audit.dto.request.AuditLogFilterRequest;
import com.cyclosa.audit.dto.response.*;
import com.cyclosa.audit.entity.AuditLog;
import com.cyclosa.audit.enums.AuditAction;
import com.cyclosa.audit.event.AuditLogEvent;
import com.cyclosa.audit.exception.AuditErrorCode;
import com.cyclosa.audit.mapper.AuditLogMapper;
import com.cyclosa.audit.repository.AuditLogRepository;
import com.cyclosa.audit.repository.specification.AuditLogSpecification;
import com.cyclosa.audit.util.AuditMaskingUtils;
import com.cyclosa.audit.util.JsonDiffUtils;
import com.cyclosa.auth.entity.User;
import com.cyclosa.auth.service.UserService;
import com.cyclosa.common.exception.AppException;
import com.cyclosa.common.response.PageData;
import com.cyclosa.employee.entity.Employee;
import com.cyclosa.employee.service.EmployeeService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuditLogService {

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of("occurredAt", "action", "entityType", "createdAt");
    private static final long MAX_QUERY_DAYS = 180;
    private static final long MAX_EXPORT_RECORDS = 50000;

    private final AuditLogRepository auditLogRepository;
    private final AuditLogMapper auditLogMapper;
    private final UserService userService;
    private final EmployeeService employeeService;
    private final ObjectMapper objectMapper;

    /**
     * Ghi nhận một bản ghi kiểm toán mới với transaction độc lập (REQUIRES_NEW).
     * Đảm bảo lỗi ghi log không làm rollback nghiệp vụ chính và ngược lại.
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public AuditLog recordLog(AuditLogEvent event) {
        if (event == null) {
            return null;
        }

        try {
            String maskedOldValue = AuditMaskingUtils.maskToJson(event.getOldValue());
            String maskedNewValue = AuditMaskingUtils.maskToJson(event.getNewValue());

            AuditLog logEntity = AuditLog.builder()
                    .actorUserId(event.getActorUserId())
                    .action(event.getAction())
                    .entityType(event.getEntityType() != null ? event.getEntityType().toUpperCase() : "UNKNOWN")
                    .entityId(event.getEntityId() != null ? event.getEntityId() : "UNKNOWN")
                    .occurredAt(event.getOccurredAt() != null ? event.getOccurredAt() : java.time.LocalDateTime.now())
                    .ipAddress(event.getIpAddress())
                    .userAgent(event.getUserAgent())
                    .oldValue(maskedOldValue)
                    .newValue(maskedNewValue)
                    .description(event.getDescription())
                    .build();

            return auditLogRepository.save(logEntity);
        } catch (Exception e) {
            log.error("Không thể lưu nhật ký kiểm toán vào CSDL: {}", e.getMessage(), e);
            return null;
        }
    }

    /**
     * Tra cứu danh sách nhật ký kiểm toán có phân trang và bộ lọc đa tiêu chí.
     */
    @Transactional(readOnly = true)
    public PageData<AuditLogResponse> searchLogs(AuditLogFilterRequest filter) {
        validateDateRange(filter);

        Pageable pageable = filter.toPageable("occurredAt", ALLOWED_SORT_FIELDS);
        Page<AuditLog> pageResult = auditLogRepository.findAll(AuditLogSpecification.filter(filter), pageable);

        // Thu thập danh sách actorUserIds để làm giàu thông tin người thực hiện
        Set<UUID> userIds = pageResult.getContent().stream()
                .map(AuditLog::getActorUserId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        Map<UUID, ActorInfoResponse> actorMap = loadActorInfoMap(userIds);

        List<AuditLogResponse> items = pageResult.getContent().stream()
                .map(logEntity -> {
                    AuditLogResponse resp = auditLogMapper.toResponse(logEntity);
                    if (logEntity.getActorUserId() != null) {
                        resp.setActor(actorMap.get(logEntity.getActorUserId()));
                    }
                    resp.setEntityReference(buildEntityReference(logEntity));
                    return resp;
                })
                .toList();

        return PageData.of(pageResult, items);
    }

    /**
     * Xem chi tiết một bản ghi nhật ký kiểm toán kèm snapshot và danh sách trường biến động.
     */
    @Transactional(readOnly = true)
    public AuditLogDetailResponse getLogById(UUID id) {
        AuditLog logEntity = auditLogRepository.findById(id)
                .orElseThrow(() -> new AppException(AuditErrorCode.AUDIT_LOG_NOT_FOUND));

        AuditLogDetailResponse response = auditLogMapper.toDetailResponse(logEntity);

        if (logEntity.getActorUserId() != null) {
            response.setActor(getDetailedActorInfo(logEntity.getActorUserId()));
        }

        // Chuyển đổi JSON snapshot sang Object để trả về cho Client
        response.setOldValue(parseJsonObject(logEntity.getOldValue()));
        response.setNewValue(parseJsonObject(logEntity.getNewValue()));

        // Tính toán Visual Diff danh sách các trường thay đổi
        List<ChangedFieldResponse> changedFields = JsonDiffUtils.computeDiff(logEntity.getOldValue(), logEntity.getNewValue());
        response.setChangedFields(changedFields);

        return response;
    }

    /**
     * Lấy toàn bộ dòng thời gian truy vết (Audit Trail) của một thực thể cụ thể theo thứ tự thời gian tăng dần.
     */
    @Transactional(readOnly = true)
    public AuditTrailTimelineResponse getEntityAuditTrail(String entityType, String entityId) {
        if (entityType == null || entityType.isBlank() || entityId == null || entityId.isBlank()) {
            throw new AppException(AuditErrorCode.AUDIT_ENTITY_INVALID);
        }

        List<AuditLog> logs = auditLogRepository.findByEntityTypeIgnoreCaseAndEntityIdOrderByOccurredAtAsc(
                entityType.trim(), entityId.trim()
        );

        Set<UUID> userIds = logs.stream()
                .map(AuditLog::getActorUserId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        Map<UUID, ActorInfoResponse> actorMap = loadActorInfoMap(userIds);

        List<AuditTrailEventResponse> timeline = logs.stream()
                .map(logEntity -> {
                    AuditTrailEventResponse event = auditLogMapper.toTimelineEvent(logEntity);
                    if (logEntity.getActorUserId() != null) {
                        ActorInfoResponse actor = actorMap.get(logEntity.getActorUserId());
                        if (actor != null) {
                            String jobTitle = actor.getJobTitle() != null ? " (" + actor.getJobTitle() + ")" : "";
                            event.setActorName(actor.getFullName() + jobTitle);
                        }
                    } else {
                        event.setActorName("Hệ thống tự động");
                    }
                    return event;
                })
                .toList();

        return AuditTrailTimelineResponse.builder()
                .entityType(entityType.toUpperCase())
                .entityId(entityId)
                .totalEvents(timeline.size())
                .timeline(timeline)
                .build();
    }

    /**
     * Lấy danh mục 13 hành động kiểm toán chuẩn hóa phục vụ UI Dropdown.
     */
    public List<AuditActionDefinitionResponse> getActionDefinitions() {
        return Arrays.stream(AuditAction.values())
                .map(action -> AuditActionDefinitionResponse.builder()
                        .code(action.name())
                        .name(action.getDisplayName())
                        .badgeVariant(action.getBadgeVariant())
                        .build())
                .toList();
    }

    /**
     * Yêu cầu xuất dữ liệu báo cáo nhật ký kiểm toán.
     * Tự động thực hiện cơ chế "Kiểm toán ngược (Auditing the Auditor)" bằng cách ghi 1 dòng audit log với action EXPORT.
     */
    @Transactional
    public AuditExportResponse exportLogs(AuditLogFilterRequest filter, UUID currentUserId, String clientIp, String userAgent) {
        validateDateRange(filter);

        long count = auditLogRepository.count(AuditLogSpecification.filter(filter));
        if (count > MAX_EXPORT_RECORDS) {
            throw new AppException(AuditErrorCode.AUDIT_EXPORT_LIMIT_EXCEEDED);
        }

        String jobId = "JOB-AUDIT-EXP-" + System.currentTimeMillis();
        String format = (filter.getFormat() != null && filter.getFormat().equalsIgnoreCase("CSV")) ? "csv" : "xlsx";
        String downloadUrl = "/api/v1/files/downloads/export-audit-" + jobId + "." + format;

        // Ghi nhận Audit Log hành vi xuất dữ liệu
        AuditLogEvent exportEvent = AuditLogEvent.builder()
                .actorUserId(currentUserId)
                .action(AuditAction.EXPORT)
                .entityType("AUDIT_LOG")
                .entityId(jobId)
                .ipAddress(clientIp)
                .userAgent(userAgent)
                .description("Xuất file báo cáo nhật ký kiểm toán (" + count + " bản ghi, định dạng " + format.toUpperCase() + ")")
                .build();
        recordLog(exportEvent);

        return AuditExportResponse.builder()
                .jobId(jobId)
                .estimatedRecords(count)
                .downloadUrl(downloadUrl)
                .status("COMPLETED")
                .build();
    }

    // --- Private Helper Methods ---

    private void validateDateRange(AuditLogFilterRequest filter) {
        if (filter.getFrom() != null && filter.getTo() != null) {
            if (filter.getFrom().isAfter(filter.getTo())) {
                throw new AppException(AuditErrorCode.AUDIT_DATE_RANGE_INVALID);
            }
            long days = ChronoUnit.DAYS.between(filter.getFrom(), filter.getTo());
            if (days > MAX_QUERY_DAYS) {
                throw new AppException(AuditErrorCode.AUDIT_DATE_RANGE_INVALID);
            }
        }
    }

    private Map<UUID, ActorInfoResponse> loadActorInfoMap(Set<UUID> userIds) {
        if (userIds == null || userIds.isEmpty()) {
            return Collections.emptyMap();
        }

        Map<UUID, ActorInfoResponse> map = new HashMap<>();
        for (UUID userId : userIds) {
            try {
                ActorInfoResponse info = getDetailedActorInfo(userId);
                if (info != null) {
                    map.put(userId, info);
                }
            } catch (Exception e) {
                log.debug("Không thể tải thông tin actor id={}: {}", userId, e.getMessage());
            }
        }
        return map;
    }

    private ActorInfoResponse getDetailedActorInfo(UUID userId) {
        Optional<User> userOpt = userService.findUserEntityById(userId);
        if (userOpt.isEmpty()) {
            return ActorInfoResponse.builder()
                    .id(userId)
                    .fullName("Người dùng #" + userId.toString().substring(0, 8))
                    .build();
        }

        User user = userOpt.get();
        ActorInfoResponse.ActorInfoResponseBuilder builder = ActorInfoResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .avatarUrl(user.getAvatarUrl());

        // Tra cứu thêm hồ sơ nhân viên để lấy Họ tên, Chức vụ, Phòng ban
        Optional<Employee> empOpt = employeeService.findByUserId(userId);
        if (empOpt.isPresent()) {
            Employee emp = empOpt.get();
            builder.fullName(emp.getFullName());
            if (emp.getWorkAssignments() != null && !emp.getWorkAssignments().isEmpty()) {
                com.cyclosa.employee.entity.EmployeeWorkAssignment latest = emp.getWorkAssignments().get(0);
                if (latest.getJobTitle() != null) {
                    builder.jobTitle(latest.getJobTitle().getName());
                }
                if (latest.getDepartment() != null) {
                    if (latest.getDepartment().getVersions() != null && !latest.getDepartment().getVersions().isEmpty()) {
                        builder.department(latest.getDepartment().getVersions().get(0).getName());
                    } else {
                        builder.department(latest.getDepartment().getCode());
                    }
                }
            }
        } else {
            builder.fullName(user.getUsername());
        }

        return builder.build();
    }

    private String buildEntityReference(AuditLog log) {
        return log.getEntityType() + " #" + log.getEntityId();
    }

    private Object parseJsonObject(String jsonStr) {
        if (jsonStr == null || jsonStr.isBlank()) {
            return null;
        }
        try {
            return objectMapper.readValue(jsonStr, Object.class);
        } catch (Exception e) {
            return jsonStr;
        }
    }
}
