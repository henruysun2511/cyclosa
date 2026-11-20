package com.cyclosa.attendance.controller;

import com.cyclosa.attendance.dto.request.CreateShiftRequest;
import com.cyclosa.attendance.dto.request.ShiftFilter;
import com.cyclosa.attendance.dto.request.UpdateShiftRequest;
import com.cyclosa.attendance.dto.response.ShiftResponse;
import com.cyclosa.attendance.service.ShiftService;
import com.cyclosa.common.annotation.RequirePermission;
import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.common.response.PageData;
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
@RequestMapping("/api/v1/shifts")
@RequiredArgsConstructor
@Tag(name = "Shifts", description = "Quản lý danh mục ca làm việc của doanh nghiệp")
public class ShiftController {

    private final ShiftService shiftService;

    @GetMapping
    @PreAuthorize("@perm.has('attendance.view')")
    @RequirePermission("attendance.view")
    @Operation(summary = "Xem danh sách ca làm việc", description = "Lọc theo trạng thái kích hoạt, tìm kiếm từ khóa, phân trang")
    public ResponseEntity<ApiResponse<PageData<ShiftResponse>>> getShifts(@Valid ShiftFilter filter) {
        PageData<ShiftResponse> result = shiftService.getShifts(filter);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách ca làm việc thành công"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("@perm.has('attendance.view')")
    @RequirePermission("attendance.view")
    @Operation(summary = "Xem chi tiết ca làm việc")
    public ResponseEntity<ApiResponse<ShiftResponse>> getShiftById(@PathVariable UUID id) {
        ShiftResponse result = shiftService.getShiftById(id);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy chi tiết ca làm việc thành công"));
    }

    @PostMapping
    @PreAuthorize("@perm.has('attendance.shift_manage')")
    @RequirePermission("attendance.shift_manage")
    @Operation(summary = "Tạo mới ca làm việc")
    public ResponseEntity<ApiResponse<ShiftResponse>> createShift(@Valid @RequestBody CreateShiftRequest req) {
        ShiftResponse result = shiftService.createShift(req);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(result, "Tạo mới ca làm việc thành công"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("@perm.has('attendance.shift_manage')")
    @RequirePermission("attendance.shift_manage")
    @Operation(summary = "Cập nhật ca làm việc")
    public ResponseEntity<ApiResponse<ShiftResponse>> updateShift(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateShiftRequest req) {
        ShiftResponse result = shiftService.updateShift(id, req);
        return ResponseEntity.ok(ApiResponse.ok(result, "Cập nhật ca làm việc thành công"));
    }

    @PostMapping("/{id}/activate")
    @PreAuthorize("@perm.has('attendance.shift_manage')")
    @RequirePermission("attendance.shift_manage")
    @Operation(summary = "Kích hoạt ca làm việc")
    public ResponseEntity<ApiResponse<Void>> activateShift(@PathVariable UUID id) {
        shiftService.activateShift(id, true);
        return ResponseEntity.ok(ApiResponse.noContent("Kích hoạt ca làm việc thành công"));
    }

    @PostMapping("/{id}/deactivate")
    @PreAuthorize("@perm.has('attendance.shift_manage')")
    @RequirePermission("attendance.shift_manage")
    @Operation(summary = "Ngừng sử dụng ca làm việc")
    public ResponseEntity<ApiResponse<Void>> deactivateShift(@PathVariable UUID id) {
        shiftService.activateShift(id, false);
        return ResponseEntity.ok(ApiResponse.noContent("Ngừng sử dụng ca làm việc thành công"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@perm.has('attendance.shift_manage')")
    @RequirePermission("attendance.shift_manage")
    @Operation(summary = "Xóa ca làm việc (chưa có phân ca)")
    public ResponseEntity<ApiResponse<Void>> deleteShift(@PathVariable UUID id) {
        shiftService.deleteShift(id);
        return ResponseEntity.ok(ApiResponse.noContent("Xóa ca làm việc thành công"));
    }
}

