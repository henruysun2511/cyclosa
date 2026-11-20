package com.cyclosa.attendance.controller;

import com.cyclosa.attendance.dto.request.CreateTimesheetPeriodRequest;
import com.cyclosa.attendance.dto.request.LockTimesheetPeriodRequest;
import com.cyclosa.attendance.dto.request.TimesheetPeriodFilter;
import com.cyclosa.attendance.dto.request.UnlockPeriodRequest;
import com.cyclosa.attendance.dto.response.TimesheetPeriodResponse;
import com.cyclosa.attendance.dto.response.TimesheetPreLockCheckResponse;
import com.cyclosa.attendance.dto.response.TimesheetSnapshotResponse;
import com.cyclosa.attendance.service.TimesheetPeriodService;
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

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@Tag(name = "Timesheet Periods", description = "Quản lý kỳ công tháng, khóa sổ snapshot và chuyển sang tính lương")
public class TimesheetPeriodController {

    private final TimesheetPeriodService timesheetPeriodService;

    @GetMapping("/api/v1/timesheet-periods")
    @PreAuthorize("@perm.has('attendance.view')")
    @RequirePermission("attendance.view")
    @Operation(summary = "Xem danh sách kỳ công tháng theo năm")
    public ResponseEntity<ApiResponse<PageData<TimesheetPeriodResponse>>> getPeriods(@Valid TimesheetPeriodFilter filter) {
        PageData<TimesheetPeriodResponse> result = timesheetPeriodService.getPeriods(filter);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách kỳ công thành công"));
    }

    @PostMapping("/api/v1/timesheet-periods")
    @PreAuthorize("@perm.has('attendance.period_manage')")
    @RequirePermission("attendance.period_manage")
    @Operation(summary = "Mở kỳ công tháng mới")
    public ResponseEntity<ApiResponse<TimesheetPeriodResponse>> createPeriod(@Valid @RequestBody CreateTimesheetPeriodRequest req) {
        TimesheetPeriodResponse result = timesheetPeriodService.createPeriod(req);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(result, "Mở kỳ công tháng thành công"));
    }

    @GetMapping("/api/v1/timesheet-periods/{id}")
    @PreAuthorize("@perm.has('attendance.view')")
    @RequirePermission("attendance.view")
    @Operation(summary = "Xem chi tiết kỳ công tháng")
    public ResponseEntity<ApiResponse<TimesheetPeriodResponse>> getPeriodById(@PathVariable UUID id) {
        TimesheetPeriodResponse result = timesheetPeriodService.getPeriodById(id);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy chi tiết kỳ công thành công"));
    }

    @GetMapping("/api/v1/timesheet-periods/{id}/pre-lock-check")
    @PreAuthorize("@perm.has('attendance.period_manage')")
    @RequirePermission("attendance.period_manage")
    @Operation(summary = "Kiểm tra điều kiện trước khi khóa kỳ (ngoại lệ còn tồn đọng)")
    public ResponseEntity<ApiResponse<TimesheetPreLockCheckResponse>> preLockCheck(@PathVariable UUID id) {
        TimesheetPreLockCheckResponse result = timesheetPeriodService.preLockCheck(id);
        return ResponseEntity.ok(ApiResponse.ok(result, "Kiểm tra trước khóa kỳ thành công"));
    }

    @PostMapping("/api/v1/timesheet-periods/{id}/lock")
    @PreAuthorize("@perm.has('attendance.period_manage')")
    @RequirePermission("attendance.period_manage")
    @Operation(summary = "Khóa sổ kỳ công, chốt số liệu snapshot và đồng bộ Payroll")
    public ResponseEntity<ApiResponse<TimesheetPeriodResponse>> lockPeriod(
            @PathVariable UUID id,
            @RequestBody(required = false) LockTimesheetPeriodRequest req) {
        TimesheetPeriodResponse result = timesheetPeriodService.lockPeriod(id);
        return ResponseEntity.ok(ApiResponse.ok(result, "Khóa sổ kỳ công thành công"));
    }

    @PostMapping("/api/v1/timesheet-periods/{id}/unlock")
    @PreAuthorize("@perm.has('attendance.period_unlock')")
    @RequirePermission("attendance.period_unlock")
    @Operation(summary = "Mở khóa kỳ công có kiểm soát (yêu cầu lý do)")
    public ResponseEntity<ApiResponse<TimesheetPeriodResponse>> unlockPeriod(
            @PathVariable UUID id,
            @Valid @RequestBody UnlockPeriodRequest req) {
        TimesheetPeriodResponse result = timesheetPeriodService.unlockPeriod(id, req);
        return ResponseEntity.ok(ApiResponse.ok(result, "Mở khóa kỳ công thành công"));
    }

    @GetMapping("/api/v1/timesheet-periods/{id}/snapshots")
    @PreAuthorize("@perm.has('attendance.view')")
    @RequirePermission("attendance.view")
    @Operation(summary = "Bảng công đã chốt kèm chi tiết giờ làm thêm (OT)")
    public ResponseEntity<ApiResponse<PageData<TimesheetSnapshotResponse>>> getSnapshots(
            @PathVariable UUID id,
            Pageable pageable) {
        PageData<TimesheetSnapshotResponse> result = timesheetPeriodService.getSnapshots(id, pageable);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy bảng công chốt thành công"));
    }

    @GetMapping("/api/v1/me/timesheet-snapshots")
    @Operation(summary = "Bảng công đã chốt của cá nhân tôi theo năm")
    public ResponseEntity<ApiResponse<List<TimesheetSnapshotResponse>>> getMySnapshots(
            @RequestParam(required = false) Integer year) {
        List<TimesheetSnapshotResponse> result = timesheetPeriodService.getMySnapshots(year);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy bảng công cá nhân đã chốt thành công"));
    }
}

