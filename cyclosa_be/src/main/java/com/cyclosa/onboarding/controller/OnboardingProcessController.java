package com.cyclosa.onboarding.controller;

import com.cyclosa.common.annotation.RequirePermission;
import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.common.response.PageData;
import com.cyclosa.common.util.SecurityUtils;
import com.cyclosa.onboarding.dto.OnboardingProcessDto;
import com.cyclosa.onboarding.service.OnboardingProcessService;
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
@RequiredArgsConstructor
@Tag(name = "Onboarding Processes", description = "Quản lý tiến trình hội nhập nhân viên mới từ mẫu checklist")
public class OnboardingProcessController {

    private final OnboardingProcessService service;

    @PostMapping("/api/v1/onboarding-processes")
    @PreAuthorize("@perm.has('onboarding.manage')")
    @RequirePermission("onboarding.manage")
    @Operation(summary = "Khởi tạo tiến trình hội nhập cho nhân viên mới từ mẫu checklist")
    public ResponseEntity<ApiResponse<OnboardingProcessDto.DetailResponse>> create(
            @Valid @RequestBody OnboardingProcessDto.CreateRequest request
    ) {
        OnboardingProcessDto.DetailResponse res = service.createProcess(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(res, "Khởi tạo tiến trình hội nhập thành công"));
    }

    @GetMapping("/api/v1/onboarding-processes")
    @PreAuthorize("@perm.has('onboarding.view')")
    @RequirePermission("onboarding.view")
    @Operation(summary = "Tìm kiếm và phân trang danh sách tiến trình hội nhập toàn công ty")
    public ResponseEntity<ApiResponse<PageData<OnboardingProcessDto.Response>>> search(
            @ModelAttribute OnboardingProcessDto.FilterRequest filter
    ) {
        PageData<OnboardingProcessDto.Response> res = service.searchProcesses(filter);
        return ResponseEntity.ok(ApiResponse.ok(res, "Lấy danh sách tiến trình hội nhập thành công"));
    }

    @GetMapping("/api/v1/onboarding-processes/{id}")
    @PreAuthorize("@perm.has('onboarding.view')")
    @RequirePermission("onboarding.view")
    @Operation(summary = "Xem chi tiết tiến trình hội nhập kèm danh sách công việc và tiến độ")
    public ResponseEntity<ApiResponse<OnboardingProcessDto.DetailResponse>> getById(@PathVariable UUID id) {
        OnboardingProcessDto.DetailResponse res = service.getProcessById(id);
        return ResponseEntity.ok(ApiResponse.ok(res, "Lấy thông tin tiến trình thành công"));
    }

    @GetMapping("/api/v1/employees/{employeeId}/onboarding")
    @PreAuthorize("@perm.has('onboarding.view')")
    @RequirePermission("onboarding.view")
    @Operation(summary = "Xem tiến trình hội nhập của một nhân viên cụ thể")
    public ResponseEntity<ApiResponse<OnboardingProcessDto.DetailResponse>> getByEmployeeId(
            @PathVariable UUID employeeId
    ) {
        OnboardingProcessDto.DetailResponse res = service.getProcessByEmployeeId(employeeId);
        return ResponseEntity.ok(ApiResponse.ok(res, "Lấy tiến trình hội nhập của nhân viên thành công"));
    }

    @GetMapping("/api/v1/me/onboarding")
    @Operation(summary = "Tiến trình hội nhập của chính tôi (Cổng thông tin nhân viên mới)")
    public ResponseEntity<ApiResponse<OnboardingProcessDto.DetailResponse>> getMyOnboarding() {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        OnboardingProcessDto.DetailResponse res = service.getProcessByEmployeeId(currentUserId);
        return ResponseEntity.ok(ApiResponse.ok(res, "Lấy thông tin hội nhập cá nhân thành công"));
    }

    @PostMapping("/api/v1/onboarding-processes/{id}/accept")
    @PreAuthorize("@perm.has('onboarding.manage')")
    @RequirePermission("onboarding.manage")
    @Operation(summary = "HR nghiệm thu tiến trình hội nhập (yêu cầu hoàn tất mọi việc bắt buộc)")
    public ResponseEntity<ApiResponse<OnboardingProcessDto.Response>> accept(@PathVariable UUID id) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        OnboardingProcessDto.Response res = service.acceptProcess(id, currentUserId);
        return ResponseEntity.ok(ApiResponse.ok(res, "Nghiệm thu tiến trình hội nhập thành công"));
    }

    @PostMapping("/api/v1/onboarding-processes/{id}/cancel")
    @PreAuthorize("@perm.has('onboarding.manage')")
    @RequirePermission("onboarding.manage")
    @Operation(summary = "Hủy bỏ tiến trình hội nhập")
    public ResponseEntity<ApiResponse<OnboardingProcessDto.Response>> cancel(@PathVariable UUID id) {
        OnboardingProcessDto.Response res = service.cancelProcess(id);
        return ResponseEntity.ok(ApiResponse.ok(res, "Đã hủy bỏ tiến trình hội nhập"));
    }
}

