package com.cyclosa.career.controller;

import com.cyclosa.career.dto.request.AddSuccessionCandidateRequest;
import com.cyclosa.career.dto.request.CreateSuccessionPlanRequest;
import com.cyclosa.career.dto.request.SuccessionPlanFilter;
import com.cyclosa.career.dto.request.UpdateSuccessionCandidateRequest;
import com.cyclosa.career.dto.request.UpdateSuccessionPlanRequest;
import com.cyclosa.career.dto.response.SuccessionCandidateResponse;
import com.cyclosa.career.dto.response.SuccessionPlanDetailResponse;
import com.cyclosa.career.dto.response.SuccessionPlanResponse;
import com.cyclosa.career.dto.response.SuccessionSuggestionResponse;
import com.cyclosa.career.service.SuccessionPlanService;
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

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/succession-plans")
@RequiredArgsConstructor
@Tag(name = "Succession Planning", description = "Quản lý quy hoạch kế nhiệm vị trí trọng yếu")
public class SuccessionPlanController {

    private final SuccessionPlanService successionPlanService;

    @GetMapping
    @PreAuthorize("@perm.has('succession.view')")
    @RequirePermission("succession.view")
    @Operation(summary = "Lấy danh sách kế hoạch kế nhiệm có phân trang và bộ lọc")
    public ResponseEntity<ApiResponse<PageData<SuccessionPlanResponse>>> getSuccessionPlans(@Valid SuccessionPlanFilter filter) {
        PageData<SuccessionPlanResponse> result = successionPlanService.getSuccessionPlans(filter);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách kế hoạch kế nhiệm thành công"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("@perm.has('succession.view')")
    @RequirePermission("succession.view")
    @Operation(summary = "Lấy chi tiết kế hoạch kế nhiệm và danh sách ứng viên kế cận")
    public ResponseEntity<ApiResponse<SuccessionPlanDetailResponse>> getSuccessionPlanById(@PathVariable UUID id) {
        SuccessionPlanDetailResponse result = successionPlanService.getSuccessionPlanById(id);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy chi tiết kế hoạch kế nhiệm thành công"));
    }

    @PostMapping
    @PreAuthorize("@perm.has('succession.manage')")
    @RequirePermission("succession.manage")
    @Operation(summary = "Tạo mới kế hoạch kế nhiệm vị trí trọng yếu")
    public ResponseEntity<ApiResponse<SuccessionPlanResponse>> createSuccessionPlan(
            @Valid @RequestBody CreateSuccessionPlanRequest request) {
        SuccessionPlanResponse result = successionPlanService.createSuccessionPlan(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(result, "Tạo kế hoạch kế nhiệm thành công"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("@perm.has('succession.manage')")
    @RequirePermission("succession.manage")
    @Operation(summary = "Cập nhật kế hoạch kế nhiệm (mức độ rủi ro, ngày rà soát)")
    public ResponseEntity<ApiResponse<SuccessionPlanResponse>> updateSuccessionPlan(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateSuccessionPlanRequest request) {
        SuccessionPlanResponse result = successionPlanService.updateSuccessionPlan(id, request);
        return ResponseEntity.ok(ApiResponse.ok(result, "Cập nhật kế hoạch kế nhiệm thành công"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@perm.has('succession.manage')")
    @RequirePermission("succession.manage")
    @Operation(summary = "Xóa kế hoạch kế nhiệm")
    public ResponseEntity<ApiResponse<Void>> deleteSuccessionPlan(@PathVariable UUID id) {
        successionPlanService.deleteSuccessionPlan(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Xóa kế hoạch kế nhiệm thành công"));
    }

    @PostMapping("/{id}/candidates")
    @PreAuthorize("@perm.has('succession.manage')")
    @RequirePermission("succession.manage")
    @Operation(summary = "Thêm ứng viên kế cận vào kế hoạch")
    public ResponseEntity<ApiResponse<SuccessionCandidateResponse>> addCandidate(
            @PathVariable UUID id,
            @Valid @RequestBody AddSuccessionCandidateRequest request) {
        SuccessionCandidateResponse result = successionPlanService.addCandidate(id, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(result, "Thêm ứng viên kế nhiệm thành công"));
    }

    @PutMapping("/{id}/candidates/{employeeId}")
    @PreAuthorize("@perm.has('succession.manage')")
    @RequirePermission("succession.manage")
    @Operation(summary = "Cập nhật mức độ sẵn sàng và lộ trình đào tạo của ứng viên")
    public ResponseEntity<ApiResponse<SuccessionCandidateResponse>> updateCandidate(
            @PathVariable UUID id,
            @PathVariable UUID employeeId,
            @Valid @RequestBody UpdateSuccessionCandidateRequest request) {
        SuccessionCandidateResponse result = successionPlanService.updateCandidate(id, employeeId, request);
        return ResponseEntity.ok(ApiResponse.ok(result, "Cập nhật ứng viên thành công"));
    }

    @DeleteMapping("/{id}/candidates/{employeeId}")
    @PreAuthorize("@perm.has('succession.manage')")
    @RequirePermission("succession.manage")
    @Operation(summary = "Gỡ bỏ ứng viên khỏi kế hoạch kế nhiệm")
    public ResponseEntity<ApiResponse<Void>> removeCandidate(
            @PathVariable UUID id,
            @PathVariable UUID employeeId) {
        successionPlanService.removeCandidate(id, employeeId);
        return ResponseEntity.ok(ApiResponse.ok(null, "Gỡ bỏ ứng viên thành công"));
    }

    @GetMapping("/{id}/suggestions")
    @PreAuthorize("@perm.has('succession.view')")
    @RequirePermission("succession.view")
    @Operation(summary = "Gợi ý tự động các ứng viên sáng giá từ Kho nhân tài nội bộ")
    public ResponseEntity<ApiResponse<List<SuccessionSuggestionResponse>>> getSuggestions(@PathVariable UUID id) {
        List<SuccessionSuggestionResponse> result = successionPlanService.getSuggestions(id);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách gợi ý ứng viên thành công"));
    }
}
