package com.cyclosa.leave.controller;

import com.cyclosa.common.annotation.RequirePermission;
import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.common.response.PageData;
import com.cyclosa.leave.dto.request.CreateLeavePolicyRequest;
import com.cyclosa.leave.dto.request.LeavePolicyFilter;
import com.cyclosa.leave.dto.request.UpdateLeavePolicyRequest;
import com.cyclosa.leave.dto.response.LeavePolicyResponse;
import com.cyclosa.leave.service.LeavePolicyService;
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
@RequestMapping("/api/v1/leave-policies")
@RequiredArgsConstructor
@Tag(name = "Leave Policies", description = "Quản lý chính sách định mức nghỉ phép năm, thâm niên và hạn chuyển phép")
public class LeavePolicyController {

    private final LeavePolicyService leavePolicyService;

    @GetMapping
    @PreAuthorize("@perm.has('leave.view')")
    @RequirePermission("leave.view")
    @Operation(summary = "Lấy danh sách phân trang chính sách nghỉ phép năm")
    public ResponseEntity<ApiResponse<PageData<LeavePolicyResponse>>> getLeavePolicies(
            @Valid LeavePolicyFilter filter) {
        PageData<LeavePolicyResponse> result = leavePolicyService.getLeavePolicies(filter);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách chính sách thành công"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("@perm.has('leave.view')")
    @RequirePermission("leave.view")
    @Operation(summary = "Xem chi tiết chính sách nghỉ phép theo ID")
    public ResponseEntity<ApiResponse<LeavePolicyResponse>> getLeavePolicyById(@PathVariable UUID id) {
        LeavePolicyResponse result = leavePolicyService.getLeavePolicyById(id);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy chi tiết chính sách thành công"));
    }

    @PostMapping
    @PreAuthorize("@perm.has('leave.config')")
    @RequirePermission("leave.config")
    @Operation(summary = "Tạo mới chính sách nghỉ phép năm")
    public ResponseEntity<ApiResponse<LeavePolicyResponse>> createLeavePolicy(
            @Valid @RequestBody CreateLeavePolicyRequest request) {
        LeavePolicyResponse result = leavePolicyService.createLeavePolicy(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(result, "Tạo mới chính sách thành công"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("@perm.has('leave.config')")
    @RequirePermission("leave.config")
    @Operation(summary = "Cập nhật chính sách nghỉ phép năm")
    public ResponseEntity<ApiResponse<LeavePolicyResponse>> updateLeavePolicy(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateLeavePolicyRequest request) {
        LeavePolicyResponse result = leavePolicyService.updateLeavePolicy(id, request);
        return ResponseEntity.ok(ApiResponse.ok(result, "Cập nhật chính sách thành công"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@perm.has('leave.config')")
    @RequirePermission("leave.config")
    @Operation(summary = "Xóa chính sách nghỉ phép")
    public ResponseEntity<ApiResponse<Void>> deleteLeavePolicy(@PathVariable UUID id) {
        leavePolicyService.deleteLeavePolicy(id);
        return ResponseEntity.ok(ApiResponse.noContent("Xóa chính sách thành công"));
    }
}
