package com.cyclosa.onboarding.controller;

import com.cyclosa.common.annotation.RequirePermission;
import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.common.response.PageData;
import com.cyclosa.onboarding.dto.OrientationSessionDto;
import com.cyclosa.onboarding.service.OrientationSessionService;
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
@RequestMapping("/api/v1/orientation-sessions")
@RequiredArgsConstructor
@Tag(name = "Orientation Sessions", description = "Quản lý các buổi đào tạo định hướng văn hóa & nội quy cho nhân viên mới")
public class OrientationSessionController {

    private final OrientationSessionService service;

    @GetMapping
    @PreAuthorize("@perm.has('onboarding.view')")
    @RequirePermission("onboarding.view")
    @Operation(summary = "Tìm kiếm và phân trang danh sách buổi đào tạo định hướng")
    public ResponseEntity<ApiResponse<PageData<OrientationSessionDto.Response>>> search(
            @ModelAttribute OrientationSessionDto.FilterRequest filter
    ) {
        PageData<OrientationSessionDto.Response> res = service.searchSessions(filter);
        return ResponseEntity.ok(ApiResponse.ok(res, "Lấy danh sách buổi đào tạo thành công"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("@perm.has('onboarding.view')")
    @RequirePermission("onboarding.view")
    @Operation(summary = "Xem chi tiết buổi đào tạo định hướng")
    public ResponseEntity<ApiResponse<OrientationSessionDto.Response>> getById(@PathVariable UUID id) {
        OrientationSessionDto.Response res = service.getById(id);
        return ResponseEntity.ok(ApiResponse.ok(res, "Lấy thông tin buổi đào tạo thành công"));
    }

    @PostMapping
    @PreAuthorize("@perm.has('onboarding.manage')")
    @RequirePermission("onboarding.manage")
    @Operation(summary = "Lên lịch buổi đào tạo định hướng mới")
    public ResponseEntity<ApiResponse<OrientationSessionDto.Response>> create(
            @Valid @RequestBody OrientationSessionDto.CreateRequest request
    ) {
        OrientationSessionDto.Response res = service.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(res, "Lên lịch buổi đào tạo thành công"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("@perm.has('onboarding.manage')")
    @RequirePermission("onboarding.manage")
    @Operation(summary = "Cập nhật buổi đào tạo định hướng")
    public ResponseEntity<ApiResponse<OrientationSessionDto.Response>> update(
            @PathVariable UUID id,
            @Valid @RequestBody OrientationSessionDto.UpdateRequest request
    ) {
        OrientationSessionDto.Response res = service.update(id, request);
        return ResponseEntity.ok(ApiResponse.ok(res, "Cập nhật buổi đào tạo thành công"));
    }

    @PostMapping("/{id}/complete")
    @PreAuthorize("@perm.has('onboarding.manage')")
    @RequirePermission("onboarding.manage")
    @Operation(summary = "Xác nhận hoàn thành buổi đào tạo định hướng")
    public ResponseEntity<ApiResponse<OrientationSessionDto.Response>> complete(@PathVariable UUID id) {
        OrientationSessionDto.Response res = service.complete(id);
        return ResponseEntity.ok(ApiResponse.ok(res, "Xác nhận hoàn thành buổi đào tạo thành công"));
    }

    @PostMapping("/{id}/cancel")
    @PreAuthorize("@perm.has('onboarding.manage')")
    @RequirePermission("onboarding.manage")
    @Operation(summary = "Hủy buổi đào tạo định hướng")
    public ResponseEntity<ApiResponse<OrientationSessionDto.Response>> cancel(@PathVariable UUID id) {
        OrientationSessionDto.Response res = service.cancel(id);
        return ResponseEntity.ok(ApiResponse.ok(res, "Đã hủy buổi đào tạo định hướng"));
    }

    @PostMapping("/{id}/attendance")
    @PreAuthorize("@perm.has('onboarding.manage')")
    @RequirePermission("onboarding.manage")
    @Operation(summary = "Điểm danh nhân viên tham dự (tự động hoàn thành các công việc ORIENTATION tương ứng)")
    public ResponseEntity<ApiResponse<Void>> recordAttendance(
            @PathVariable UUID id,
            @Valid @RequestBody OrientationSessionDto.AttendanceRequest request
    ) {
        service.recordAttendance(id, request);
        return ResponseEntity.ok(ApiResponse.noContent("Điểm danh nhân viên tham dự thành công"));
    }
}

