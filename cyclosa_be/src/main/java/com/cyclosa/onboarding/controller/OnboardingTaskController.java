package com.cyclosa.onboarding.controller;

import com.cyclosa.common.annotation.RequirePermission;
import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.common.util.SecurityUtils;
import com.cyclosa.onboarding.dto.OnboardingTaskDto;
import com.cyclosa.onboarding.service.OnboardingProcessService;
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
@Tag(name = "Onboarding Tasks", description = "Quản lý và thực hiện các nhiệm vụ trong tiến trình hội nhập")
public class OnboardingTaskController {

    private final OnboardingProcessService processService;

    @GetMapping("/api/v1/onboarding-processes/{processId}/tasks")
    @PreAuthorize("@perm.has('onboarding.view')")
    @RequirePermission("onboarding.view")
    @Operation(summary = "Lấy danh sách công việc hội nhập của tiến trình")
    public ResponseEntity<ApiResponse<List<OnboardingTaskDto.Response>>> getTasks(
            @PathVariable UUID processId
    ) {
        List<OnboardingTaskDto.Response> tasks = processService.getTasksByProcessId(processId);
        return ResponseEntity.ok(ApiResponse.ok(tasks, "Lấy danh sách công việc hội nhập thành công"));
    }

    @PostMapping("/api/v1/onboarding-processes/{processId}/tasks")
    @PreAuthorize("@perm.has('onboarding.manage')")
    @RequirePermission("onboarding.manage")
    @Operation(summary = "Bổ sung công việc phát sinh ngoài mẫu cho tiến trình")
    public ResponseEntity<ApiResponse<OnboardingTaskDto.Response>> addAdHocTask(
            @PathVariable UUID processId,
            @Valid @RequestBody OnboardingTaskDto.CreateAdHocTaskRequest request
    ) {
        OnboardingTaskDto.Response res = processService.addAdHocTask(processId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(res, "Thêm công việc hội nhập mới thành công"));
    }

    @PostMapping("/api/v1/onboarding-tasks/{id}/complete")
    @PreAuthorize("@perm.has('onboarding.manage')")
    @RequirePermission("onboarding.manage")
    @Operation(summary = "Xác nhận hoàn thành một công việc hội nhập")
    public ResponseEntity<ApiResponse<OnboardingTaskDto.Response>> completeTask(@PathVariable UUID id) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        OnboardingTaskDto.Response res = processService.completeTask(id, currentUserId);
        return ResponseEntity.ok(ApiResponse.ok(res, "Xác nhận hoàn thành công việc thành công"));
    }

    @PostMapping("/api/v1/onboarding-tasks/{id}/skip")
    @PreAuthorize("@perm.has('onboarding.manage')")
    @RequirePermission("onboarding.manage")
    @Operation(summary = "Bỏ qua công việc hội nhập (chỉ áp dụng cho công việc không bắt buộc)")
    public ResponseEntity<ApiResponse<OnboardingTaskDto.Response>> skipTask(@PathVariable UUID id) {
        OnboardingTaskDto.Response res = processService.skipTask(id);
        return ResponseEntity.ok(ApiResponse.ok(res, "Đã bỏ qua công việc"));
    }
}
