package com.cyclosa.leave.controller;

import com.cyclosa.common.annotation.RequirePermission;
import com.cyclosa.common.enums.DataScope;
import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.common.response.PageData;
import com.cyclosa.leave.dto.request.CreateLeaveRequest;
import com.cyclosa.leave.dto.request.LeaveCalendarFilter;
import com.cyclosa.leave.dto.request.LeavePreviewRequest;
import com.cyclosa.leave.dto.request.LeaveRequestFilter;
import com.cyclosa.leave.dto.request.RejectLeaveRequest;
import com.cyclosa.leave.dto.response.LeaveCalendarEventResponse;
import com.cyclosa.leave.dto.response.LeavePreviewResponse;
import com.cyclosa.leave.dto.response.LeaveRequestResponse;
import com.cyclosa.leave.service.LeaveRequestService;
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
@RequiredArgsConstructor
@Tag(name = "Leave Requests", description = "Đăng ký đơn xin nghỉ phép, xem trước ngày trừ công, duyệt và lịch nghỉ phòng ban")
public class LeaveRequestController {

    private final LeaveRequestService leaveRequestService;

    @PostMapping("/api/v1/leave-requests/preview")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Xem trước số ngày nghỉ (loại trừ cuối tuần, ngày lễ) và số dư còn lại")
    public ResponseEntity<ApiResponse<LeavePreviewResponse>> previewLeaveRequest(
            @Valid @RequestBody LeavePreviewRequest request) {
        LeavePreviewResponse result = leaveRequestService.previewLeaveRequest(request);
        return ResponseEntity.ok(ApiResponse.ok(result, "Tính toán xem trước ngày nghỉ thành công"));
    }

    @PostMapping("/api/v1/leave-requests")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Nộp đơn xin nghỉ phép (tự động đưa vào Workflow hoặc tự duyệt)")
    public ResponseEntity<ApiResponse<LeaveRequestResponse>> createLeaveRequest(
            @Valid @RequestBody CreateLeaveRequest request) {
        LeaveRequestResponse result = leaveRequestService.createLeaveRequest(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(result, "Tạo đơn xin nghỉ phép thành công"));
    }

    @GetMapping("/api/v1/me/leave-requests")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Xem danh sách đơn xin nghỉ phép của tài khoản đang đăng nhập")
    public ResponseEntity<ApiResponse<PageData<LeaveRequestResponse>>> getMyLeaveRequests(
            @Valid LeaveRequestFilter filter) {
        PageData<LeaveRequestResponse> result = leaveRequestService.getMyLeaveRequests(filter);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách đơn nghỉ của tôi thành công"));
    }

    @GetMapping("/api/v1/leave-requests")
    @PreAuthorize("@perm.has('leave.view')")
    @RequirePermission("leave.view")
    @Operation(summary = "Xem danh sách đơn xin nghỉ phép theo phạm vi phân quyền")
    public ResponseEntity<ApiResponse<PageData<LeaveRequestResponse>>> getLeaveRequests(
            @Valid LeaveRequestFilter filter) {
        PageData<LeaveRequestResponse> result = leaveRequestService.getLeaveRequests(filter);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách đơn nghỉ phép thành công"));
    }

    @GetMapping("/api/v1/leave-requests/{requestId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Xem chi tiết một đơn xin nghỉ phép")
    public ResponseEntity<ApiResponse<LeaveRequestResponse>> getLeaveRequestById(
            @PathVariable UUID requestId) {
        LeaveRequestResponse result = leaveRequestService.getLeaveRequestById(requestId);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy chi tiết đơn nghỉ phép thành công"));
    }

    @PostMapping("/api/v1/leave-requests/{requestId}/cancel")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Hủy đơn xin nghỉ phép (tự động hoàn số dư khả dụng)")
    public ResponseEntity<ApiResponse<Void>> cancelLeaveRequest(@PathVariable UUID requestId) {
        leaveRequestService.cancelLeaveRequest(requestId);
        return ResponseEntity.ok(ApiResponse.noContent("Hủy đơn xin nghỉ phép thành công"));
    }

    @PostMapping("/api/v1/leave-requests/{requestId}/approve")
    @PreAuthorize("@perm.has('leave.approve', T(com.cyclosa.common.enums.DataScope).TEAM)")
    @RequirePermission(value = "leave.approve", minScope = DataScope.TEAM)
    @Operation(summary = "Duyệt trực tiếp đơn xin nghỉ phép (quản lý / HR)")
    public ResponseEntity<ApiResponse<LeaveRequestResponse>> approveDirect(@PathVariable UUID requestId) {
        LeaveRequestResponse result = leaveRequestService.approveDirect(requestId);
        return ResponseEntity.ok(ApiResponse.ok(result, "Phê duyệt đơn nghỉ phép thành công"));
    }

    @PostMapping("/api/v1/leave-requests/{requestId}/reject")
    @PreAuthorize("@perm.has('leave.approve', T(com.cyclosa.common.enums.DataScope).TEAM)")
    @RequirePermission(value = "leave.approve", minScope = DataScope.TEAM)
    @Operation(summary = "Từ chối trực tiếp đơn xin nghỉ phép")
    public ResponseEntity<ApiResponse<LeaveRequestResponse>> rejectDirect(
            @PathVariable UUID requestId,
            @Valid @RequestBody RejectLeaveRequest request) {
        LeaveRequestResponse result = leaveRequestService.rejectDirect(requestId, request.getReason());
        return ResponseEntity.ok(ApiResponse.ok(result, "Từ chối đơn nghỉ phép thành công"));
    }

    @GetMapping("/api/v1/leave-calendar")
    @PreAuthorize("@perm.has('leave.view')")
    @RequirePermission("leave.view")
    @Operation(summary = "Lấy lịch nghỉ phép của đội nhóm / phòng ban theo khoảng ngày")
    public ResponseEntity<ApiResponse<List<LeaveCalendarEventResponse>>> getLeaveCalendar(
            @Valid LeaveCalendarFilter filter) {
        List<LeaveCalendarEventResponse> result = leaveRequestService.getLeaveCalendar(filter);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy dữ liệu lịch nghỉ phép thành công"));
    }
}
