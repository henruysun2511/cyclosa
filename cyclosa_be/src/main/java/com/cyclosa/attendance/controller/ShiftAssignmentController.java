package com.cyclosa.attendance.controller;

import com.cyclosa.attendance.dto.request.BulkShiftAssignmentRequest;
import com.cyclosa.attendance.dto.request.ShiftAssignmentFilter;
import com.cyclosa.attendance.dto.response.ShiftAssignmentResponse;
import com.cyclosa.attendance.service.ShiftAssignmentService;
import com.cyclosa.common.annotation.RequirePermission;
import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.common.response.PageData;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@Tag(name = "Shift Assignments", description = "Quản lý phân ca làm việc cho nhân viên")
public class ShiftAssignmentController {

    private final ShiftAssignmentService shiftAssignmentService;

    @GetMapping("/api/v1/shift-assignments")
    @PreAuthorize("@perm.has('attendance.view')")
    @RequirePermission("attendance.view")
    @Operation(summary = "Xem danh sách phân ca", description = "Lọc theo nhân viên, phòng ban, khoảng ngày")
    public ResponseEntity<ApiResponse<PageData<ShiftAssignmentResponse>>> getAssignments(@Valid ShiftAssignmentFilter filter) {
        PageData<ShiftAssignmentResponse> result = shiftAssignmentService.getAssignments(filter);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách phân ca thành công"));
    }

    @PostMapping("/api/v1/shift-assignments/bulk")
    @PreAuthorize("@perm.has('attendance.shift_manage')")
    @RequirePermission("attendance.shift_manage")
    @Operation(summary = "Phân ca làm việc hàng loạt theo khoảng ngày")
    public ResponseEntity<ApiResponse<List<ShiftAssignmentResponse>>> bulkAssignShifts(@Valid @RequestBody BulkShiftAssignmentRequest req) {
        List<ShiftAssignmentResponse> result = shiftAssignmentService.bulkAssignShifts(req);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(result, "Phân ca hàng loạt thành công"));
    }

    @PutMapping("/api/v1/shift-assignments/{id}")
    @PreAuthorize("@perm.has('attendance.shift_manage')")
    @RequirePermission("attendance.shift_manage")
    @Operation(summary = "Đổi ca làm việc của một ngày cụ thể")
    public ResponseEntity<ApiResponse<ShiftAssignmentResponse>> updateShiftAssignment(
            @PathVariable UUID id,
            @RequestParam UUID newShiftId) {
        ShiftAssignmentResponse result = shiftAssignmentService.updateShiftAssignment(id, newShiftId);
        return ResponseEntity.ok(ApiResponse.ok(result, "Đổi ca làm việc thành công"));
    }

    @DeleteMapping("/api/v1/shift-assignments/{id}")
    @PreAuthorize("@perm.has('attendance.shift_manage')")
    @RequirePermission("attendance.shift_manage")
    @Operation(summary = "Xóa phân ca của một ngày (trở về ca mặc định)")
    public ResponseEntity<ApiResponse<Void>> deleteShiftAssignment(@PathVariable UUID id) {
        shiftAssignmentService.deleteShiftAssignment(id);
        return ResponseEntity.ok(ApiResponse.noContent("Xóa phân ca thành công"));
    }

    @GetMapping("/api/v1/me/shifts")
    @Operation(summary = "Tra cứu lịch ca cá nhân của tôi (theo khoảng ngày)")
    public ResponseEntity<ApiResponse<List<ShiftAssignmentResponse>>> getMyShifts(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        List<ShiftAssignmentResponse> result = shiftAssignmentService.getMyShifts(from, to);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy lịch làm việc cá nhân thành công"));
    }
}

