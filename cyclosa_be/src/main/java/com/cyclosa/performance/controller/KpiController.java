package com.cyclosa.performance.controller;

import com.cyclosa.audit.aop.Auditable;
import com.cyclosa.audit.enums.AuditAction;
import com.cyclosa.common.annotation.RequirePermission;
import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.common.response.PageData;
import com.cyclosa.performance.dto.request.CreateKpiRequest;
import com.cyclosa.performance.dto.request.KpiFilter;
import com.cyclosa.performance.dto.request.UpdateKpiRequest;
import com.cyclosa.performance.dto.response.KpiResponse;
import com.cyclosa.performance.service.KpiService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/kpis")
@RequiredArgsConstructor
@Tag(name = "KPI Catalog", description = "Quản lý danh mục chỉ số KPI")
public class KpiController {

    private final KpiService kpiService;

    @GetMapping
    @PreAuthorize("@perm.has('performance.view')")
    @RequirePermission("performance.view")
    @Operation(summary = "Lấy danh mục KPI có phân trang")
    public ResponseEntity<ApiResponse<PageData<KpiResponse>>> getKpis(@Valid KpiFilter filter) {
        PageData<KpiResponse> result = kpiService.getKpis(filter);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh mục KPI thành công"));
    }

    @GetMapping("/{kpiId}")
    @PreAuthorize("@perm.has('performance.view')")
    @RequirePermission("performance.view")
    @Operation(summary = "Xem chi tiết chỉ số KPI")
    public ResponseEntity<ApiResponse<KpiResponse>> getKpiById(@PathVariable UUID kpiId) {
        KpiResponse result = kpiService.getKpiById(kpiId);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy chi tiết KPI thành công"));
    }

    @PostMapping
    @PreAuthorize("@perm.has('performance.config')")
    @RequirePermission("performance.config")
    @Auditable(action = AuditAction.CREATE, entityType = "KPI", description = "Tạo chỉ số KPI mới")
    @Operation(summary = "Tạo chỉ số KPI mới")
    public ResponseEntity<ApiResponse<KpiResponse>> createKpi(@Valid @RequestBody CreateKpiRequest request) {
        KpiResponse result = kpiService.createKpi(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.created(result, "Tạo KPI thành công"));
    }

    @PutMapping("/{kpiId}")
    @PreAuthorize("@perm.has('performance.config')")
    @RequirePermission("performance.config")
    @Auditable(action = AuditAction.UPDATE, entityType = "KPI", description = "Cập nhật thông tin KPI")
    @Operation(summary = "Cập nhật chỉ số KPI")
    public ResponseEntity<ApiResponse<KpiResponse>> updateKpi(
            @PathVariable UUID kpiId,
            @Valid @RequestBody UpdateKpiRequest request) {
        KpiResponse result = kpiService.updateKpi(kpiId, request);
        return ResponseEntity.ok(ApiResponse.ok(result, "Cập nhật KPI thành công"));
    }

    @DeleteMapping("/{kpiId}")
    @PreAuthorize("@perm.has('performance.config')")
    @RequirePermission("performance.config")
    @Auditable(action = AuditAction.DELETE, entityType = "KPI", description = "Xóa chỉ số KPI")
    @Operation(summary = "Xóa chỉ số KPI")
    public ResponseEntity<ApiResponse<Void>> deleteKpi(@PathVariable UUID kpiId) {
        kpiService.deleteKpi(kpiId);
        return ResponseEntity.ok(ApiResponse.ok(null, "Xóa KPI thành công"));
    }
}
