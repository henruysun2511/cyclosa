package com.cyclosa.performance.controller;

import com.cyclosa.audit.aop.Auditable;
import com.cyclosa.audit.enums.AuditAction;
import com.cyclosa.common.annotation.RequirePermission;
import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.common.response.PageData;
import com.cyclosa.performance.dto.request.*;
import com.cyclosa.performance.dto.response.*;
import com.cyclosa.performance.service.PerformanceReviewService;
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
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "Performance Reviews", description = "Quản lý phiếu đánh giá hiệu suất và mục tiêu cá nhân")
public class PerformanceReviewController {

    private final PerformanceReviewService reviewService;

    @PostMapping("/performance-cycles/{cycleId}/reviews")
    @PreAuthorize("@perm.has('performance.manage')")
    @RequirePermission("performance.manage")
    @Auditable(action = AuditAction.CREATE, entityType = "PERFORMANCE_REVIEW", description = "Khởi tạo hàng loạt phiếu đánh giá cho nhân viên")
    @Operation(summary = "Khởi tạo phiếu đánh giá trong kỳ")
    public ResponseEntity<ApiResponse<Void>> initializeReviews(
            @PathVariable UUID cycleId,
            @Valid @RequestBody InitializeReviewsRequest request) {
        reviewService.initializeReviews(cycleId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.created(null, "Khởi tạo phiếu đánh giá thành công"));
    }

    @GetMapping("/performance-reviews")
    @PreAuthorize("@perm.has('performance.view')")
    @RequirePermission("performance.view")
    @Operation(summary = "Lấy danh sách phiếu đánh giá có phân trang")
    public ResponseEntity<ApiResponse<PageData<PerformanceReviewResponse>>> getReviews(@Valid PerformanceReviewFilter filter) {
        PageData<PerformanceReviewResponse> result = reviewService.getReviews(filter);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách phiếu đánh giá thành công"));
    }

    @GetMapping("/performance-reviews/{reviewId}")
    @PreAuthorize("@perm.has('performance.view')")
    @RequirePermission("performance.view")
    @Operation(summary = "Xem chi tiết phiếu đánh giá kèm danh sách mục tiêu")
    public ResponseEntity<ApiResponse<PerformanceReviewDetailResponse>> getReviewDetail(@PathVariable UUID reviewId) {
        PerformanceReviewDetailResponse result = reviewService.getReviewDetail(reviewId);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy chi tiết phiếu đánh giá thành công"));
    }

    @GetMapping("/me/performance-reviews")
    @Operation(summary = "Xem danh sách phiếu đánh giá của bản thân (ESS)")
    public ResponseEntity<ApiResponse<List<PerformanceReviewResponse>>> getMyReviews() {
        List<PerformanceReviewResponse> result = reviewService.getMyReviews();
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách phiếu đánh giá cá nhân thành công"));
    }

    @PostMapping("/performance-reviews/{reviewId}/goals")
    @PreAuthorize("@perm.has('performance.manage')")
    @RequirePermission("performance.manage")
    @Auditable(action = AuditAction.CREATE, entityType = "PERFORMANCE_GOAL", description = "Giao mục tiêu cho nhân viên")
    @Operation(summary = "Thêm mục tiêu vào phiếu đánh giá")
    public ResponseEntity<ApiResponse<PerformanceGoalResponse>> addGoal(
            @PathVariable UUID reviewId,
            @Valid @RequestBody CreateGoalRequest request) {
        PerformanceGoalResponse result = reviewService.addGoal(reviewId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.created(result, "Thêm mục tiêu thành công"));
    }

    @PutMapping("/performance-goals/{goalId}")
    @PreAuthorize("@perm.has('performance.manage')")
    @RequirePermission("performance.manage")
    @Auditable(action = AuditAction.UPDATE, entityType = "PERFORMANCE_GOAL", description = "Cập nhật thông tin mục tiêu")
    @Operation(summary = "Cập nhật mục tiêu đánh giá")
    public ResponseEntity<ApiResponse<PerformanceGoalResponse>> updateGoal(
            @PathVariable UUID goalId,
            @Valid @RequestBody UpdateGoalRequest request) {
        PerformanceGoalResponse result = reviewService.updateGoal(goalId, request);
        return ResponseEntity.ok(ApiResponse.ok(result, "Cập nhật mục tiêu thành công"));
    }

    @DeleteMapping("/performance-goals/{goalId}")
    @PreAuthorize("@perm.has('performance.manage')")
    @RequirePermission("performance.manage")
    @Auditable(action = AuditAction.DELETE, entityType = "PERFORMANCE_GOAL", description = "Xóa mục tiêu")
    @Operation(summary = "Xóa mục tiêu")
    public ResponseEntity<ApiResponse<Void>> deleteGoal(@PathVariable UUID goalId) {
        reviewService.deleteGoal(goalId);
        return ResponseEntity.ok(ApiResponse.ok(null, "Xóa mục tiêu thành công"));
    }

    @PatchMapping("/performance-goals/{goalId}/status")
    @Operation(summary = "Cập nhật tiến độ mục tiêu")
    public ResponseEntity<ApiResponse<PerformanceGoalResponse>> updateGoalStatus(
            @PathVariable UUID goalId,
            @Valid @RequestBody UpdateGoalStatusRequest request) {
        PerformanceGoalResponse result = reviewService.updateGoalStatus(goalId, request);
        return ResponseEntity.ok(ApiResponse.ok(result, "Cập nhật tiến độ mục tiêu thành công"));
    }

    @PutMapping("/performance-reviews/{reviewId}/self-assessment")
    @Operation(summary = "Nhân viên lưu nháp phần tự đánh giá (ESS)")
    public ResponseEntity<ApiResponse<PerformanceReviewDetailResponse>> saveSelfAssessment(
            @PathVariable UUID reviewId,
            @Valid @RequestBody SelfAssessmentRequest request) {
        PerformanceReviewDetailResponse result = reviewService.saveSelfAssessment(reviewId, request);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lưu bản tự đánh giá thành công"));
    }

    @PostMapping("/performance-reviews/{reviewId}/self-assessment/submit")
    @Operation(summary = "Nhân viên nộp bản tự đánh giá (ESS)")
    public ResponseEntity<ApiResponse<PerformanceReviewDetailResponse>> submitSelfAssessment(@PathVariable UUID reviewId) {
        PerformanceReviewDetailResponse result = reviewService.submitSelfAssessment(reviewId);
        return ResponseEntity.ok(ApiResponse.ok(result, "Nộp bản tự đánh giá thành công"));
    }

    @PutMapping("/performance-reviews/{reviewId}/manager-assessment")
    @PreAuthorize("@perm.has('performance.review')")
    @RequirePermission("performance.review")
    @Auditable(action = AuditAction.UPDATE, entityType = "PERFORMANCE_REVIEW", description = "Quản lý chấm điểm các mục tiêu")
    @Operation(summary = "Quản lý lưu điểm đánh giá")
    public ResponseEntity<ApiResponse<PerformanceReviewDetailResponse>> saveManagerAssessment(
            @PathVariable UUID reviewId,
            @Valid @RequestBody ManagerAssessmentRequest request) {
        PerformanceReviewDetailResponse result = reviewService.saveManagerAssessment(reviewId, request);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lưu điểm đánh giá của quản lý thành công"));
    }

    @PostMapping("/performance-reviews/{reviewId}/manager-assessment/submit")
    @PreAuthorize("@perm.has('performance.review')")
    @RequirePermission("performance.review")
    @Auditable(action = AuditAction.UPDATE, entityType = "PERFORMANCE_REVIEW", description = "Quản lý nộp kết quả đánh giá")
    @Operation(summary = "Quản lý nộp kết quả đánh giá")
    public ResponseEntity<ApiResponse<PerformanceReviewDetailResponse>> submitManagerAssessment(@PathVariable UUID reviewId) {
        PerformanceReviewDetailResponse result = reviewService.submitManagerAssessment(reviewId);
        return ResponseEntity.ok(ApiResponse.ok(result, "Nộp kết quả đánh giá của quản lý thành công"));
    }

    @GetMapping("/performance-reviews/{reviewId}/score-preview")
    @PreAuthorize("@perm.has('performance.review')")
    @RequirePermission("performance.review")
    @Operation(summary = "Xem trước điểm tổng hợp và xếp loại tạm tính")
    public ResponseEntity<ApiResponse<ScorePreviewResponse>> getScorePreview(@PathVariable UUID reviewId) {
        ScorePreviewResponse result = reviewService.getScorePreview(reviewId);
        return ResponseEntity.ok(ApiResponse.ok(result, "Xem trước điểm tổng hợp thành công"));
    }

    @PostMapping("/performance-reviews/{reviewId}/finalize")
    @PreAuthorize("@perm.has('performance.finalize')")
    @RequirePermission("performance.finalize")
    @Auditable(action = AuditAction.APPROVE, entityType = "PERFORMANCE_REVIEW", description = "Chốt kết quả đánh giá bất biến (FINALIZED)")
    @Operation(summary = "Chốt kết quả đánh giá bất biến")
    public ResponseEntity<ApiResponse<PerformanceReviewDetailResponse>> finalizeReview(@PathVariable UUID reviewId) {
        PerformanceReviewDetailResponse result = reviewService.finalizeReview(reviewId);
        return ResponseEntity.ok(ApiResponse.ok(result, "Chốt kết quả đánh giá thành công"));
    }
}
