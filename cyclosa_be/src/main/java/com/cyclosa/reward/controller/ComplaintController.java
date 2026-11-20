package com.cyclosa.reward.controller;

import com.cyclosa.audit.aop.Auditable;
import com.cyclosa.audit.enums.AuditAction;
import com.cyclosa.common.annotation.RequirePermission;
import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.common.response.PageData;
import com.cyclosa.reward.dto.request.AssignComplaintRequest;
import com.cyclosa.reward.dto.request.ComplaintFilter;
import com.cyclosa.reward.dto.request.ResolveComplaintRequest;
import com.cyclosa.reward.dto.response.ComplaintResponse;
import com.cyclosa.reward.service.ComplaintService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/complaints")
@RequiredArgsConstructor
@Tag(name = "Complaints", description = "Quản lý và giải quyết khiếu nại nội bộ")
public class ComplaintController {

    private final ComplaintService complaintService;

    @GetMapping
    @PreAuthorize("@perm.has('complaint.manage')")
    @RequirePermission("complaint.manage")
    @Operation(summary = "Lấy danh sách khiếu nại", description = "Dành cho HR, lọc theo trạng thái và nhóm khiếu nại có phân trang")
    public ResponseEntity<ApiResponse<PageData<ComplaintResponse>>> getComplaints(@Valid ComplaintFilter filter) {
        PageData<ComplaintResponse> result = complaintService.getComplaints(filter);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách khiếu nại thành công"));
    }

    @GetMapping("/{complaintId}")
    @PreAuthorize("@perm.has('complaint.manage')")
    @RequirePermission("complaint.manage")
    @Operation(summary = "Xem chi tiết khiếu nại")
    public ResponseEntity<ApiResponse<ComplaintResponse>> getComplaintById(@PathVariable UUID complaintId) {
        ComplaintResponse result = complaintService.getComplaintById(complaintId);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy chi tiết khiếu nại thành công"));
    }

    @PostMapping("/{complaintId}/assign")
    @PreAuthorize("@perm.has('complaint.manage')")
    @RequirePermission("complaint.manage")
    @Auditable(action = AuditAction.UPDATE, entityType = "COMPLAINT", description = "Phân công cán bộ HR thụ lý điều tra khiếu nại")
    @Operation(summary = "Phân công cán bộ HR thụ lý điều tra khiếu nại")
    public ResponseEntity<ApiResponse<ComplaintResponse>> assignHandler(
            @PathVariable UUID complaintId,
            @Valid @RequestBody AssignComplaintRequest request) {
        ComplaintResponse result = complaintService.assignHandler(complaintId, request.getHandlerEmployeeId());
        return ResponseEntity.ok(ApiResponse.ok(result, "Phân công cán bộ thụ lý thành công"));
    }

    @PostMapping("/{complaintId}/start-investigation")
    @PreAuthorize("@perm.has('complaint.manage')")
    @RequirePermission("complaint.manage")
    @Auditable(action = AuditAction.UPDATE, entityType = "COMPLAINT", description = "Bắt đầu điều tra khiếu nại")
    @Operation(summary = "Bắt đầu điều tra khiếu nại", description = "Chuyển trạng thái sang INVESTIGATING")
    public ResponseEntity<ApiResponse<ComplaintResponse>> startInvestigation(@PathVariable UUID complaintId) {
        ComplaintResponse result = complaintService.startInvestigation(complaintId);
        return ResponseEntity.ok(ApiResponse.ok(result, "Bắt đầu điều tra khiếu nại thành công"));
    }

    @PostMapping("/{complaintId}/resolve")
    @PreAuthorize("@perm.has('complaint.manage')")
    @RequirePermission("complaint.manage")
    @Auditable(action = AuditAction.APPROVE, entityType = "COMPLAINT", description = "Ghi nhận phương án giải quyết khiếu nại")
    @Operation(summary = "Ghi nhận phương án giải quyết khiếu nại", description = "Chuyển trạng thái sang RESOLVED")
    public ResponseEntity<ApiResponse<ComplaintResponse>> resolveComplaint(
            @PathVariable UUID complaintId,
            @Valid @RequestBody ResolveComplaintRequest request) {
        ComplaintResponse result = complaintService.resolveComplaint(complaintId, request);
        return ResponseEntity.ok(ApiResponse.ok(result, "Ghi nhận phương án giải quyết thành công"));
    }

    @PostMapping("/{complaintId}/close")
    @PreAuthorize("@perm.has('complaint.manage')")
    @RequirePermission("complaint.manage")
    @Auditable(action = AuditAction.UPDATE, entityType = "COMPLAINT", description = "Đóng hồ sơ khiếu nại")
    @Operation(summary = "Đóng hồ sơ khiếu nại", description = "Chuyển trạng thái sang CLOSED. Khóa bất biến không cho giải quyết lại")
    public ResponseEntity<ApiResponse<ComplaintResponse>> closeComplaint(@PathVariable UUID complaintId) {
        ComplaintResponse result = complaintService.closeComplaint(complaintId);
        return ResponseEntity.ok(ApiResponse.ok(result, "Đóng hồ sơ khiếu nại thành công"));
    }
}
