package com.cyclosa.audit.controller;

import com.cyclosa.audit.dto.request.AuditLogFilterRequest;
import com.cyclosa.audit.dto.response.*;
import com.cyclosa.audit.service.AuditLogService;
import com.cyclosa.common.annotation.RequirePermission;
import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.common.response.PageData;
import com.cyclosa.common.util.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/audit-logs")
@RequiredArgsConstructor
@Tag(name = "Audit Logs", description = "Nhật ký kiểm toán hệ thống & dòng thời gian truy vết thực thể (Append-only Ledger)")
public class AuditLogController {

    private final AuditLogService auditLogService;

    @GetMapping
    @PreAuthorize("@perm.has('audit.view')")
    @RequirePermission(code = "audit.view")
    @Operation(summary = "Tra cứu danh sách nhật ký kiểm toán theo bộ lọc đa chiều (phân trang)")
    public ResponseEntity<ApiResponse<PageData<AuditLogResponse>>> searchLogs(
            @Valid @ParameterObject AuditLogFilterRequest filter
    ) {
        PageData<AuditLogResponse> result = auditLogService.searchLogs(filter);
        return ResponseEntity.ok(ApiResponse.ok(result, "Tra cứu nhật ký kiểm toán thành công"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("@perm.has('audit.view')")
    @RequirePermission(code = "audit.view")
    @Operation(summary = "Xem chi tiết một bản ghi nhật ký kiểm toán (kèm snapshot JSON cũ/mới và diff)")
    public ResponseEntity<ApiResponse<AuditLogDetailResponse>> getLogById(
            @PathVariable UUID id
    ) {
        AuditLogDetailResponse result = auditLogService.getLogById(id);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy chi tiết nhật ký kiểm toán thành công"));
    }

    @GetMapping("/entity/{entityType}/{entityId}")
    @PreAuthorize("@perm.has('audit.view')")
    @RequirePermission(code = "audit.view")
    @Operation(summary = "Lấy toàn bộ dòng thời gian truy vết (Audit Trail) của một thực thể cụ thể")
    public ResponseEntity<ApiResponse<AuditTrailTimelineResponse>> getEntityAuditTrail(
            @PathVariable String entityType,
            @PathVariable String entityId
    ) {
        AuditTrailTimelineResponse result = auditLogService.getEntityAuditTrail(entityType, entityId);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy lịch sử truy vết thực thể thành công"));
    }

    @GetMapping("/actions")
    @PreAuthorize("@perm.has('audit.view')")
    @RequirePermission(code = "audit.view")
    @Operation(summary = "Lấy danh mục 13 hành động kiểm toán chuẩn hóa phục vụ bộ lọc UI")
    public ResponseEntity<ApiResponse<List<AuditActionDefinitionResponse>>> getActionDefinitions() {
        List<AuditActionDefinitionResponse> result = auditLogService.getActionDefinitions();
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh mục hành động kiểm toán thành công"));
    }

    @GetMapping("/export")
    @PreAuthorize("@perm.has('audit.export')")
    @RequirePermission(code = "audit.export")
    @Operation(summary = "Xuất file Excel/CSV nhật ký kiểm toán theo tiêu chí lọc (Tự động ghi audit log EXPORT)")
    public ResponseEntity<ApiResponse<AuditExportResponse>> exportLogs(
            @Valid @ParameterObject AuditLogFilterRequest filter,
            HttpServletRequest request
    ) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        String clientIp = extractClientIp(request);
        String userAgent = request.getHeader("User-Agent");

        AuditExportResponse result = auditLogService.exportLogs(filter, currentUserId, clientIp, userAgent);
        return ResponseEntity.ok(ApiResponse.ok(result, "Yêu cầu trích xuất nhật ký kiểm toán đã được tiếp nhận"));
    }

    private String extractClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isBlank()) {
            return xForwardedFor.split(",")[0].trim();
        }
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isBlank()) {
            return xRealIp.trim();
        }
        return request.getRemoteAddr();
    }
}

