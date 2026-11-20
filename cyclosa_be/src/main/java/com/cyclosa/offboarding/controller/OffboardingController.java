package com.cyclosa.offboarding.controller;

import com.cyclosa.audit.aop.Auditable;
import com.cyclosa.audit.enums.AuditAction;
import com.cyclosa.common.annotation.RequirePermission;
import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.common.response.PageData;
import com.cyclosa.offboarding.dto.request.*;
import com.cyclosa.offboarding.dto.response.*;
import com.cyclosa.offboarding.service.OffboardingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/offboarding")
@RequiredArgsConstructor
@Tag(name = "Offboarding & Clearance", description = "Quản lý quy trình thôi việc, quyết định chấm dứt hợp đồng và 5 hạng mục bàn giao")
public class OffboardingController {

    private final OffboardingService offboardingService;

    @GetMapping("/requests")
    @PreAuthorize("@perm.has('offboarding.view')")
    @RequirePermission("offboarding.view")
    @Operation(summary = "Lấy danh sách hồ sơ thôi việc có phân trang & tìm kiếm")
    public ResponseEntity<ApiResponse<PageData<OffboardingRequestResponse>>> getRequests(@Valid OffboardingFilter filter) {
        PageData<OffboardingRequestResponse> result = offboardingService.getRequests(filter);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách hồ sơ thôi việc thành công"));
    }

    @GetMapping("/requests/statistics")
    @PreAuthorize("@perm.has('offboarding.view')")
    @RequirePermission("offboarding.view")
    @Operation(summary = "Lấy thống kê chỉ số hồ sơ thôi việc")
    public ResponseEntity<ApiResponse<OffboardingStatisticsResponse>> getStatistics() {
        OffboardingStatisticsResponse stats = offboardingService.getStatistics();
        return ResponseEntity.ok(ApiResponse.ok(stats, "Lấy thống kê hồ sơ thôi việc thành công"));
    }

    @GetMapping("/requests/{id}")
    @PreAuthorize("@perm.has('offboarding.view')")
    @RequirePermission("offboarding.view")
    @Operation(summary = "Lấy thông tin chi tiết một hồ sơ thôi việc")
    public ResponseEntity<ApiResponse<OffboardingRequestResponse>> getRequestById(@PathVariable UUID id) {
        OffboardingRequestResponse response = offboardingService.getRequestById(id);
        return ResponseEntity.ok(ApiResponse.ok(response, "Lấy chi tiết hồ sơ thôi việc thành công"));
    }

    @PostMapping("/requests/resignations")
    @PreAuthorize("@perm.has('offboarding.create')")
    @RequirePermission("offboarding.create")
    @Auditable(action = AuditAction.CREATE, entityType = "OFFBOARDING", description = "Tiếp nhận đơn xin thôi việc tự nguyện")
    @Operation(summary = "Tiếp nhận / Tạo đơn xin thôi việc tự nguyện")
    public ResponseEntity<ApiResponse<OffboardingRequestResponse>> createResignation(
            @Valid @RequestBody CreateResignationRequest request) {
        OffboardingRequestResponse response = offboardingService.createResignation(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(response, "Tiếp nhận đơn xin thôi việc thành công"));
    }

    @PostMapping("/requests/terminations")
    @PreAuthorize("@perm.has('offboarding.create')")
    @RequirePermission("offboarding.create")
    @Auditable(action = AuditAction.CREATE, entityType = "OFFBOARDING", description = "Ban hành quyết định chấm dứt hợp đồng lao động")
    @Operation(summary = "Ban hành quyết định chấm dứt hợp đồng lao động")
    public ResponseEntity<ApiResponse<OffboardingRequestResponse>> createTermination(
            @Valid @RequestBody CreateTerminationRequest request) {
        OffboardingRequestResponse response = offboardingService.createTermination(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(response, "Ban hành quyết định chấm dứt HĐLĐ thành công"));
    }

    @PutMapping("/requests/{id}/approve")
    @PreAuthorize("@perm.has('offboarding.approve')")
    @RequirePermission("offboarding.approve")
    @Auditable(action = AuditAction.UPDATE, entityType = "OFFBOARDING", description = "Phê duyệt đơn xin thôi việc")
    @Operation(summary = "Phê duyệt đơn xin thôi việc & kích hoạt 5 hạng mục bàn giao")
    public ResponseEntity<ApiResponse<OffboardingRequestResponse>> approveResignation(
            @PathVariable UUID id,
            @Valid @RequestBody ApproveResignationRequest request) {
        OffboardingRequestResponse response = offboardingService.approveResignation(id, request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Phê duyệt đơn xin thôi việc thành công"));
    }

    @PutMapping("/requests/{id}/reject")
    @PreAuthorize("@perm.has('offboarding.approve')")
    @RequirePermission("offboarding.approve")
    @Auditable(action = AuditAction.UPDATE, entityType = "OFFBOARDING", description = "Từ chối đơn xin thôi việc")
    @Operation(summary = "Từ chối đơn xin thôi việc")
    public ResponseEntity<ApiResponse<OffboardingRequestResponse>> rejectResignation(
            @PathVariable UUID id,
            @Valid @RequestBody RejectResignationRequest request) {
        OffboardingRequestResponse response = offboardingService.rejectResignation(id, request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Từ chối đơn xin thôi việc thành công"));
    }

    @GetMapping("/requests/{id}/clearance")
    @PreAuthorize("@perm.has('offboarding.view')")
    @RequirePermission("offboarding.view")
    @Operation(summary = "Lấy danh sách 5 hạng mục bàn giao")
    public ResponseEntity<ApiResponse<List<OffboardingClearanceItemResponse>>> getClearanceItems(@PathVariable UUID id) {
        List<OffboardingClearanceItemResponse> items = offboardingService.getClearanceItems(id);
        return ResponseEntity.ok(ApiResponse.ok(items, "Lấy danh sách hạng mục bàn giao thành công"));
    }

    @PutMapping("/requests/{id}/clearance/{itemId}")
    @PreAuthorize("@perm.has('offboarding.clearance')")
    @RequirePermission("offboarding.clearance")
    @Auditable(action = AuditAction.UPDATE, entityType = "OFFBOARDING", description = "Xác nhận trạng thái hạng mục bàn giao")
    @Operation(summary = "Cập nhật / Xác nhận hạng mục bàn giao")
    public ResponseEntity<ApiResponse<OffboardingClearanceItemResponse>> updateClearanceItem(
            @PathVariable UUID id,
            @PathVariable UUID itemId,
            @Valid @RequestBody UpdateClearanceItemRequest request) {
        OffboardingClearanceItemResponse response = offboardingService.updateClearanceItem(id, itemId, request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Cập nhật hạng mục bàn giao thành công"));
    }

    @GetMapping("/requests/{id}/handover-protocol")
    @PreAuthorize("@perm.has('offboarding.view')")
    @RequirePermission("offboarding.view")
    @Operation(summary = "Lấy dữ liệu Biên bản bàn giao & thu hồi chỗ ngồi, tài sản")
    public ResponseEntity<ApiResponse<OffboardingHandoverProtocolResponse>> getHandoverProtocol(@PathVariable UUID id) {
        OffboardingHandoverProtocolResponse response = offboardingService.getHandoverProtocol(id);
        return ResponseEntity.ok(ApiResponse.ok(response, "Lấy biên bản bàn giao thành công"));
    }

    @PostMapping("/requests/{id}/return-assets")
    @PreAuthorize("@perm.has('offboarding.clearance')")
    @RequirePermission("offboarding.clearance")
    @Auditable(action = AuditAction.UPDATE, entityType = "OFFBOARDING", description = "Thu hồi tài sản bàn giao về kho")
    @Operation(summary = "Thu hồi tài sản bàn giao về kho và tự động hoàn thành hạng mục tài sản")
    public ResponseEntity<ApiResponse<OffboardingHandoverProtocolResponse>> returnOffboardingAssets(
            @PathVariable UUID id,
            @Valid @RequestBody ReturnOffboardingAssetsRequest request) {
        OffboardingHandoverProtocolResponse response = offboardingService.returnOffboardingAssets(id, request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Thu hồi tài sản và cập nhật hạng mục bàn giao thành công"));
    }

    @GetMapping("/requests/{id}/exit-interview")
    @PreAuthorize("@perm.has('offboarding.view')")
    @RequirePermission("offboarding.view")
    @Operation(summary = "Lấy thông tin phỏng vấn thôi việc")
    public ResponseEntity<ApiResponse<ExitInterviewResponse>> getExitInterview(@PathVariable UUID id) {
        ExitInterviewResponse response = offboardingService.getExitInterview(id);
        return ResponseEntity.ok(ApiResponse.ok(response, "Lấy thông tin phỏng vấn thôi việc thành công"));
    }

    @PostMapping("/requests/{id}/exit-interview")
    @PreAuthorize("@perm.has('offboarding.interview')")
    @RequirePermission("offboarding.interview")
    @Auditable(action = AuditAction.UPDATE, entityType = "OFFBOARDING", description = "Ghi nhận phỏng vấn thôi việc")
    @Operation(summary = "Ghi nhận hoặc cập nhật phỏng vấn thôi việc")
    public ResponseEntity<ApiResponse<ExitInterviewResponse>> saveExitInterview(
            @PathVariable UUID id,
            @Valid @RequestBody SaveExitInterviewRequest request) {
        ExitInterviewResponse response = offboardingService.saveExitInterview(id, request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Lưu thông tin phỏng vấn thôi việc thành công"));
    }

    @GetMapping("/requests/{id}/summary")
    @PreAuthorize("@perm.has('offboarding.view')")
    @RequirePermission("offboarding.view")
    @Operation(summary = "Tổng hợp tiến độ và kiểm tra điều kiện hoàn tất")
    public ResponseEntity<ApiResponse<OffboardingSummaryResponse>> getSummary(@PathVariable UUID id) {
        OffboardingSummaryResponse response = offboardingService.getSummary(id);
        return ResponseEntity.ok(ApiResponse.ok(response, "Lấy tổng hợp điều kiện thôi việc thành công"));
    }

    @PutMapping("/requests/{id}/complete")
    @PreAuthorize("@perm.has('offboarding.complete')")
    @RequirePermission("offboarding.complete")
    @Auditable(action = AuditAction.UPDATE, entityType = "OFFBOARDING", description = "Hoàn tất thủ tục thôi việc, khóa tài khoản và cập nhật trạng thái nhân viên")
    @Operation(summary = "Thực thi hoàn tất thủ tục thôi việc")
    public ResponseEntity<ApiResponse<OffboardingRequestResponse>> completeOffboarding(@PathVariable UUID id) {
        OffboardingRequestResponse response = offboardingService.completeOffboarding(id);
        return ResponseEntity.ok(ApiResponse.ok(response, "Hoàn tất thủ tục thôi việc thành công"));
    }

    @DeleteMapping("/requests/{id}")
    @PreAuthorize("@perm.has('offboarding.delete')")
    @RequirePermission("offboarding.delete")
    @Auditable(action = AuditAction.DELETE, entityType = "OFFBOARDING", description = "Xóa hồ sơ thôi việc")
    @Operation(summary = "Xóa hồ sơ thôi việc (chỉ cho phép ở trạng thái Chờ duyệt hoặc Bị từ chối)")
    public ResponseEntity<ApiResponse<Void>> deleteRequest(@PathVariable UUID id) {
        offboardingService.deleteRequest(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Xóa hồ sơ thôi việc thành công"));
    }
}
