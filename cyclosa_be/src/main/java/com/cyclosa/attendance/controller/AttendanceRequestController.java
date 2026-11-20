package com.cyclosa.attendance.controller;

import com.cyclosa.attendance.dto.request.ApproveAttendanceRequest;
import com.cyclosa.attendance.dto.request.AttendanceRequestFilter;
import com.cyclosa.attendance.dto.request.CreateAttendanceRequest;
import com.cyclosa.attendance.dto.request.CreateAttendanceRequestDto;
import com.cyclosa.attendance.dto.request.UpdateApprovedTimesRequest;
import com.cyclosa.attendance.dto.response.AttendanceAdjustmentResponse;
import com.cyclosa.attendance.dto.response.AttendanceRequestResponse;
import com.cyclosa.attendance.service.AttendanceRequestService;
import com.cyclosa.common.annotation.RequirePermission;
import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.common.response.PageData;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@Tag(name = "Attendance Requests", description = "Quản lý đơn giải trình chấm công và điều chỉnh công")
public class AttendanceRequestController {

    private final AttendanceRequestService attendanceRequestService;

    @PostMapping("/api/v1/attendance-requests")
    @Operation(summary = "Gửi đơn giải trình chấm công mới")
    public ResponseEntity<ApiResponse<AttendanceRequestResponse>> createRequest(
            @Valid @RequestBody CreateAttendanceRequest req) {
        AttendanceRequestResponse result = attendanceRequestService.createRequest(req);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(result, "Gửi đơn giải trình thành công"));
    }

    @GetMapping("/api/v1/me/attendance-requests")
    @Operation(summary = "Lịch sử đơn giải trình của tôi")
    public ResponseEntity<ApiResponse<PageData<AttendanceRequestResponse>>> getMyRequests(
            @Valid AttendanceRequestFilter filter) {
        PageData<AttendanceRequestResponse> result = attendanceRequestService.getMyRequests(filter);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách đơn giải trình cá nhân thành công"));
    }

    @GetMapping("/api/v1/attendance-requests")
    @PreAuthorize("@perm.has('attendance.view')")
    @RequirePermission("attendance.view")
    @Operation(summary = "Danh sách đơn giải trình toàn công ty")
    public ResponseEntity<ApiResponse<PageData<AttendanceRequestResponse>>> getAllRequests(
            @Valid AttendanceRequestFilter filter) {
        PageData<AttendanceRequestResponse> result = attendanceRequestService.getAllRequests(filter);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách đơn giải trình thành công"));
    }

    @GetMapping("/api/v1/attendance-requests/{id}")
    @Operation(summary = "Chi tiết đơn giải trình và bản ghi điều chỉnh phát sinh")
    public ResponseEntity<ApiResponse<AttendanceRequestResponse>> getRequestById(@PathVariable UUID id) {
        AttendanceRequestResponse result = attendanceRequestService.getRequestById(id);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy chi tiết đơn giải trình thành công"));
    }

    @PostMapping("/api/v1/attendance-requests/{id}/cancel")
    @Operation(summary = "Hủy đơn giải trình khi còn trạng thái PENDING")
    public ResponseEntity<ApiResponse<Void>> cancelRequest(@PathVariable UUID id) {
        attendanceRequestService.cancelRequest(id);
        return ResponseEntity.ok(ApiResponse.noContent("Đã hủy đơn giải trình thành công"));
    }

    @PutMapping("/api/v1/attendance-requests/{id}/approved-times")
    @PreAuthorize("@perm.has('attendance.approve')")
    @RequirePermission("attendance.approve")
    @Operation(summary = "Người duyệt hiệu chỉnh giờ công nhận & Phê duyệt đơn giải trình")
    public ResponseEntity<ApiResponse<AttendanceRequestResponse>> approveRequest(
            @PathVariable UUID id,
            @RequestBody(required = false) ApproveAttendanceRequest body) {
        AttendanceRequestResponse result = attendanceRequestService.updateApprovedTimesAndApprove(id, body);
        return ResponseEntity.ok(ApiResponse.ok(result, "Phê duyệt đơn giải trình thành công"));
    }

    @PostMapping("/api/v1/attendance-requests/{id}/reject")
    @PreAuthorize("@perm.has('attendance.approve')")
    @RequirePermission("attendance.approve")
    @Operation(summary = "Từ chối đơn giải trình chấm công")
    public ResponseEntity<ApiResponse<AttendanceRequestResponse>> rejectRequest(
            @PathVariable UUID id,
            @RequestParam(required = false) String reason) {
        AttendanceRequestResponse result = attendanceRequestService.rejectRequest(id, reason);
        return ResponseEntity.ok(ApiResponse.ok(result, "Từ chối đơn giải trình thành công"));
    }

    @GetMapping("/api/v1/attendance-adjustments")
    @PreAuthorize("@perm.has('attendance.view')")
    @RequirePermission("attendance.view")
    @Operation(summary = "Danh sách bản ghi điều chỉnh công sau phê duyệt")
    public ResponseEntity<ApiResponse<PageData<AttendanceAdjustmentResponse>>> getAdjustments(
            @RequestParam(required = false) UUID employeeId,
            Pageable pageable) {
        PageData<AttendanceAdjustmentResponse> result = attendanceRequestService.getAdjustments(employeeId, pageable);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách bản ghi điều chỉnh công thành công"));
    }
}
