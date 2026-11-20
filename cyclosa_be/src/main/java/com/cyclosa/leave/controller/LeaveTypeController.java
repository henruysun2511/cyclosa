package com.cyclosa.leave.controller;

import com.cyclosa.common.annotation.RequirePermission;
import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.common.response.PageData;
import com.cyclosa.leave.dto.request.CreateLeaveTypeRequest;
import com.cyclosa.leave.dto.request.LeaveTypeFilter;
import com.cyclosa.leave.dto.request.UpdateLeaveTypeRequest;
import com.cyclosa.leave.dto.response.LeaveTypeResponse;
import com.cyclosa.leave.service.LeaveTypeService;
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
@RequestMapping("/api/v1/leave-types")
@RequiredArgsConstructor
@Tag(name = "Leave Types", description = "Quản lý danh mục loại nghỉ phép và nguồn chi trả chế độ")
public class LeaveTypeController {

    private final LeaveTypeService leaveTypeService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Lấy danh sách phân trang loại nghỉ phép")
    public ResponseEntity<ApiResponse<PageData<LeaveTypeResponse>>> getLeaveTypes(@Valid LeaveTypeFilter filter) {
        PageData<LeaveTypeResponse> result = leaveTypeService.getLeaveTypes(filter);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách loại nghỉ phép thành công"));
    }

    @GetMapping("/active")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Lấy danh sách loại nghỉ đang kích hoạt (phục vụ dropdown)")
    public ResponseEntity<ApiResponse<List<LeaveTypeResponse>>> getActiveLeaveTypes() {
        List<LeaveTypeResponse> result = leaveTypeService.getActiveLeaveTypes();
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách loại nghỉ kích hoạt thành công"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Xem chi tiết loại nghỉ phép theo ID")
    public ResponseEntity<ApiResponse<LeaveTypeResponse>> getLeaveTypeById(@PathVariable UUID id) {
        LeaveTypeResponse result = leaveTypeService.getLeaveTypeById(id);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy chi tiết loại nghỉ phép thành công"));
    }

    @PostMapping
    @PreAuthorize("@perm.has('leave.config')")
    @RequirePermission("leave.config")
    @Operation(summary = "Tạo mới loại nghỉ phép")
    public ResponseEntity<ApiResponse<LeaveTypeResponse>> createLeaveType(
            @Valid @RequestBody CreateLeaveTypeRequest request) {
        LeaveTypeResponse result = leaveTypeService.createLeaveType(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(result, "Tạo mới loại nghỉ phép thành công"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("@perm.has('leave.config')")
    @RequirePermission("leave.config")
    @Operation(summary = "Cập nhật thông tin loại nghỉ phép")
    public ResponseEntity<ApiResponse<LeaveTypeResponse>> updateLeaveType(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateLeaveTypeRequest request) {
        LeaveTypeResponse result = leaveTypeService.updateLeaveType(id, request);
        return ResponseEntity.ok(ApiResponse.ok(result, "Cập nhật loại nghỉ phép thành công"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@perm.has('leave.config')")
    @RequirePermission("leave.config")
    @Operation(summary = "Xóa loại nghỉ phép (khi chưa có chính sách hoặc đơn tham chiếu)")
    public ResponseEntity<ApiResponse<Void>> deleteLeaveType(@PathVariable UUID id) {
        leaveTypeService.deleteLeaveType(id);
        return ResponseEntity.ok(ApiResponse.noContent("Xóa loại nghỉ phép thành công"));
    }
}
