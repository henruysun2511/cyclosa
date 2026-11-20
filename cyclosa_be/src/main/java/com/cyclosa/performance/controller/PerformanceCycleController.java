package com.cyclosa.performance.controller;

import com.cyclosa.audit.aop.Auditable;
import com.cyclosa.audit.enums.AuditAction;
import com.cyclosa.common.annotation.RequirePermission;
import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.common.response.PageData;
import com.cyclosa.performance.dto.request.CreatePerformanceCycleRequest;
import com.cyclosa.performance.dto.request.PerformanceCycleFilter;
import com.cyclosa.performance.dto.request.UpdatePerformanceCycleRequest;
import com.cyclosa.performance.dto.response.PerformanceCycleResponse;
import com.cyclosa.performance.dto.response.PerformanceCycleSummaryResponse;
import com.cyclosa.performance.service.PerformanceCycleService;
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
@RequestMapping("/api/v1/performance-cycles")
@RequiredArgsConstructor
@Tag(name = "Performance Cycles", description = "Quản lý kỳ đánh giá hiệu suất")
public class PerformanceCycleController {

    private final PerformanceCycleService cycleService;

    @GetMapping
    @PreAuthorize("@perm.has('performance.view')")
    @RequirePermission("performance.view")
    @Operation(summary = "Lấy danh sách kỳ đánh giá")
    public ResponseEntity<ApiResponse<PageData<PerformanceCycleResponse>>> getCycles(@Valid PerformanceCycleFilter filter) {
        PageData<PerformanceCycleResponse> result = cycleService.getCycles(filter);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách kỳ đánh giá thành công"));
    }

    @GetMapping("/{cycleId}")
    @PreAuthorize("@perm.has('performance.view')")
    @RequirePermission("performance.view")
    @Operation(summary = "Xem chi tiết kỳ đánh giá")
    public ResponseEntity<ApiResponse<PerformanceCycleResponse>> getCycleById(@PathVariable UUID cycleId) {
        PerformanceCycleResponse result = cycleService.getCycleById(cycleId);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy chi tiết kỳ đánh giá thành công"));
    }

    @PostMapping
    @PreAuthorize("@perm.has('performance.config')")
    @RequirePermission("performance.config")
    @Auditable(action = AuditAction.CREATE, entityType = "PERFORMANCE_CYCLE", description = "Tạo kỳ đánh giá mới")
    @Operation(summary = "Tạo kỳ đánh giá mới")
    public ResponseEntity<ApiResponse<PerformanceCycleResponse>> createCycle(@Valid @RequestBody CreatePerformanceCycleRequest request) {
        PerformanceCycleResponse result = cycleService.createCycle(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.created(result, "Tạo kỳ đánh giá thành công"));
    }

    @PutMapping("/{cycleId}")
    @PreAuthorize("@perm.has('performance.config')")
    @RequirePermission("performance.config")
    @Auditable(action = AuditAction.UPDATE, entityType = "PERFORMANCE_CYCLE", description = "Cập nhật thông tin kỳ đánh giá")
    @Operation(summary = "Cập nhật kỳ đánh giá")
    public ResponseEntity<ApiResponse<PerformanceCycleResponse>> updateCycle(
            @PathVariable UUID cycleId,
            @Valid @RequestBody UpdatePerformanceCycleRequest request) {
        PerformanceCycleResponse result = cycleService.updateCycle(cycleId, request);
        return ResponseEntity.ok(ApiResponse.ok(result, "Cập nhật kỳ đánh giá thành công"));
    }

    @DeleteMapping("/{cycleId}")
    @PreAuthorize("@perm.has('performance.config')")
    @RequirePermission("performance.config")
    @Auditable(action = AuditAction.DELETE, entityType = "PERFORMANCE_CYCLE", description = "Xóa kỳ đánh giá")
    @Operation(summary = "Xóa kỳ đánh giá")
    public ResponseEntity<ApiResponse<Void>> deleteCycle(@PathVariable UUID cycleId) {
        cycleService.deleteCycle(cycleId);
        return ResponseEntity.ok(ApiResponse.ok(null, "Xóa kỳ đánh giá thành công"));
    }

    @PostMapping("/{cycleId}/activate")
    @PreAuthorize("@perm.has('performance.config')")
    @RequirePermission("performance.config")
    @Auditable(action = AuditAction.UPDATE, entityType = "PERFORMANCE_CYCLE", description = "Kích hoạt kỳ đánh giá")
    @Operation(summary = "Kích hoạt kỳ đánh giá")
    public ResponseEntity<ApiResponse<PerformanceCycleResponse>> activateCycle(@PathVariable UUID cycleId) {
        PerformanceCycleResponse result = cycleService.activateCycle(cycleId);
        return ResponseEntity.ok(ApiResponse.ok(result, "Kích hoạt kỳ đánh giá thành công"));
    }

    @PostMapping("/{cycleId}/close")
    @PreAuthorize("@perm.has('performance.config')")
    @RequirePermission("performance.config")
    @Auditable(action = AuditAction.UPDATE, entityType = "PERFORMANCE_CYCLE", description = "Đóng kỳ đánh giá")
    @Operation(summary = "Đóng kỳ đánh giá")
    public ResponseEntity<ApiResponse<PerformanceCycleResponse>> closeCycle(@PathVariable UUID cycleId) {
        PerformanceCycleResponse result = cycleService.closeCycle(cycleId);
        return ResponseEntity.ok(ApiResponse.ok(result, "Đóng kỳ đánh giá thành công"));
    }

    @GetMapping("/{cycleId}/summary")
    @PreAuthorize("@perm.has('performance.view')")
    @RequirePermission("performance.view")
    @Operation(summary = "Thống kê phân bổ xếp loại của kỳ")
    public ResponseEntity<ApiResponse<PerformanceCycleSummaryResponse>> getCycleSummary(@PathVariable UUID cycleId) {
        PerformanceCycleSummaryResponse result = cycleService.getCycleSummary(cycleId);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy thống kê kỳ đánh giá thành công"));
    }
}
