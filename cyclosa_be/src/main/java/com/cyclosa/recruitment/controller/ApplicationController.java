package com.cyclosa.recruitment.controller;

import com.cyclosa.common.annotation.RequirePermission;
import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.common.response.PageData;
import com.cyclosa.recruitment.client.dto.AiClientDto;
import com.cyclosa.recruitment.dto.ApplicationDto;
import com.cyclosa.recruitment.service.AiScreeningService;
import com.cyclosa.recruitment.service.ApplicationService;
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
@RequestMapping("/api/v1/recruitment/applications")
@RequiredArgsConstructor
@Tag(name = "Application", description = "Quản lý hồ sơ ứng tuyển & sàng lọc AI")
public class ApplicationController {

    private final ApplicationService applicationService;
    private final AiScreeningService aiScreeningService;

    @PostMapping
    @PreAuthorize("@perm.has('recruitment.application.manage')")
    @RequirePermission("recruitment.application.manage")
    @Operation(summary = "Tiếp nhận hồ sơ ứng tuyển mới")
    public ResponseEntity<ApiResponse<ApplicationDto.Response>> createApplication(
            @Valid @RequestBody ApplicationDto.CreateRequest request
    ) {
        ApplicationDto.Response response = applicationService.createApplication(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(response, "Tiếp nhận hồ sơ ứng tuyển thành công"));
    }

    @PutMapping("/{id}/stage")
    @PreAuthorize("@perm.has('recruitment.application.manage')")
    @RequirePermission("recruitment.application.manage")
    @Operation(summary = "Chuyển giai đoạn ứng tuyển (APPLIED -> SCREENING -> INTERVIEW -> OFFER -> HIRED)")
    public ResponseEntity<ApiResponse<ApplicationDto.Response>> updateStage(
            @PathVariable UUID id,
            @Valid @RequestBody ApplicationDto.UpdateStageRequest request
    ) {
        ApplicationDto.Response response = applicationService.updateStage(id, request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Chuyển giai đoạn ứng tuyển thành công"));
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("@perm.has('recruitment.application.manage')")
    @RequirePermission("recruitment.application.manage")
    @Operation(summary = "Từ chối hồ sơ ứng viên")
    public ResponseEntity<ApiResponse<ApplicationDto.Response>> rejectApplication(
            @PathVariable UUID id,
            @RequestBody(required = false) ApplicationDto.RejectRequest request
    ) {
        ApplicationDto.RejectRequest req = request != null ? request : new ApplicationDto.RejectRequest();
        ApplicationDto.Response response = applicationService.rejectApplication(id, req);
        return ResponseEntity.ok(ApiResponse.ok(response, "Đã từ chối hồ sơ ứng viên"));
    }

    @PostMapping("/{id}/withdraw")
    @PreAuthorize("@perm.has('recruitment.application.manage')")
    @RequirePermission("recruitment.application.manage")
    @Operation(summary = "Ghi nhận ứng viên chủ động rút hồ sơ")
    public ResponseEntity<ApiResponse<ApplicationDto.Response>> withdrawApplication(
            @PathVariable UUID id,
            @RequestParam(required = false) String reason
    ) {
        ApplicationDto.Response response = applicationService.withdrawApplication(id, reason);
        return ResponseEntity.ok(ApiResponse.ok(response, "Đã ghi nhận ứng viên rút hồ sơ"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("@perm.has('recruitment.application.view')")
    @RequirePermission("recruitment.application.view")
    @Operation(summary = "Xem chi tiết hồ sơ ứng tuyển kèm điểm AI matching")
    public ResponseEntity<ApiResponse<ApplicationDto.Response>> getApplicationById(
            @PathVariable UUID id
    ) {
        ApplicationDto.Response response = applicationService.getApplicationById(id);
        return ResponseEntity.ok(ApiResponse.ok(response, "Lấy chi tiết hồ sơ ứng tuyển thành công"));
    }

    @GetMapping
    @PreAuthorize("@perm.has('recruitment.application.view')")
    @RequirePermission("recruitment.application.view")
    @Operation(summary = "Tìm kiếm và phân trang danh sách hồ sơ ứng tuyển")
    public ResponseEntity<ApiResponse<PageData<ApplicationDto.Response>>> searchApplications(
            @ModelAttribute ApplicationDto.FilterRequest filter
    ) {
        PageData<ApplicationDto.Response> response = applicationService.searchApplications(filter);
        return ResponseEntity.ok(ApiResponse.ok(response, "Lấy danh sách hồ sơ ứng tuyển thành công"));
    }

    @PostMapping("/{id}/ai-screen")
    @PreAuthorize("@perm.has('recruitment.application.manage')")
    @RequirePermission("recruitment.application.manage")
    @Operation(summary = "Kích hoạt AI tự động chấm điểm độ khớp CV so với JD")
    public ResponseEntity<ApiResponse<AiClientDto.CvScreenResponse>> screenApplicationWithAi(
            @PathVariable UUID id
    ) {
        AiClientDto.CvScreenResponse response = aiScreeningService.screenApplication(id);
        return ResponseEntity.ok(ApiResponse.ok(response, "AI sàng lọc CV thành công"));
    }
}
