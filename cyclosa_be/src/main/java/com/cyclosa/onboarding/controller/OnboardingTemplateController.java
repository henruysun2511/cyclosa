package com.cyclosa.onboarding.controller;

import com.cyclosa.common.annotation.RequirePermission;
import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.common.response.PageData;
import com.cyclosa.onboarding.dto.OnboardingTemplateDto;
import com.cyclosa.onboarding.service.OnboardingTemplateService;
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
@RequestMapping("/api/v1/onboarding-templates")
@RequiredArgsConstructor
@Tag(name = "Onboarding Templates", description = "Quản lý và thiết kế các mẫu checklist hội nhập cho phòng ban và chức danh")
public class OnboardingTemplateController {

    private final OnboardingTemplateService service;

    @GetMapping
    @PreAuthorize("@perm.has('onboarding.view')")
    @RequirePermission("onboarding.view")
    @Operation(summary = "Tìm kiếm và phân trang danh sách mẫu checklist hội nhập")
    public ResponseEntity<ApiResponse<PageData<OnboardingTemplateDto.Response>>> search(
            @ModelAttribute OnboardingTemplateDto.FilterRequest filter
    ) {
        PageData<OnboardingTemplateDto.Response> res = service.searchTemplates(filter);
        return ResponseEntity.ok(ApiResponse.ok(res, "Lấy danh sách mẫu checklist thành công"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("@perm.has('onboarding.view')")
    @RequirePermission("onboarding.view")
    @Operation(summary = "Xem chi tiết mẫu checklist và toàn bộ các hạng mục")
    public ResponseEntity<ApiResponse<OnboardingTemplateDto.Response>> getById(@PathVariable UUID id) {
        OnboardingTemplateDto.Response res = service.getById(id);
        return ResponseEntity.ok(ApiResponse.ok(res, "Lấy chi tiết mẫu checklist thành công"));
    }

    @PostMapping
    @PreAuthorize("@perm.has('onboarding.manage')")
    @RequirePermission("onboarding.manage")
    @Operation(summary = "Tạo mới mẫu checklist kèm các hạng mục công việc")
    public ResponseEntity<ApiResponse<OnboardingTemplateDto.Response>> create(
            @Valid @RequestBody OnboardingTemplateDto.CreateRequest request
    ) {
        OnboardingTemplateDto.Response res = service.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(res, "Tạo mẫu checklist hội nhập thành công"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("@perm.has('onboarding.manage')")
    @RequirePermission("onboarding.manage")
    @Operation(summary = "Cập nhật thông tin chung của mẫu checklist (không ảnh hưởng tiến trình đang chạy)")
    public ResponseEntity<ApiResponse<OnboardingTemplateDto.Response>> update(
            @PathVariable UUID id,
            @Valid @RequestBody OnboardingTemplateDto.UpdateRequest request
    ) {
        OnboardingTemplateDto.Response res = service.update(id, request);
        return ResponseEntity.ok(ApiResponse.ok(res, "Cập nhật mẫu checklist thành công"));
    }

    @PutMapping("/{id}/items")
    @PreAuthorize("@perm.has('onboarding.manage')")
    @RequirePermission("onboarding.manage")
    @Operation(summary = "Thay thế/sắp xếp lại danh sách các hạng mục trong mẫu checklist")
    public ResponseEntity<ApiResponse<OnboardingTemplateDto.Response>> updateItems(
            @PathVariable UUID id,
            @Valid @RequestBody OnboardingTemplateDto.UpdateItemsRequest request
    ) {
        OnboardingTemplateDto.Response res = service.updateItems(id, request);
        return ResponseEntity.ok(ApiResponse.ok(res, "Cập nhật danh sách hạng mục thành công"));
    }

    @PostMapping("/{id}/deactivate")
    @PreAuthorize("@perm.has('onboarding.manage')")
    @RequirePermission("onboarding.manage")
    @Operation(summary = "Ngừng kích hoạt sử dụng mẫu checklist")
    public ResponseEntity<ApiResponse<OnboardingTemplateDto.Response>> deactivate(@PathVariable UUID id) {
        OnboardingTemplateDto.Response res = service.deactivate(id);
        return ResponseEntity.ok(ApiResponse.ok(res, "Đã ngừng kích hoạt mẫu checklist"));
    }
}

