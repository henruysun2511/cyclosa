package com.cyclosa.recruitment.controller;

import com.cyclosa.common.annotation.RequirePermission;
import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.common.response.PageData;
import com.cyclosa.recruitment.dto.RecruitmentRequestDto;
import com.cyclosa.recruitment.service.RecruitmentRequestService;
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
@RequestMapping("/api/v1/recruitment/requests")
@RequiredArgsConstructor
@Tag(name = "Recruitment Request", description = "Quản lý phiếu yêu cầu tuyển dụng nhân sự")
public class RecruitmentRequestController {

    private final RecruitmentRequestService requestService;

    @PostMapping
    @PreAuthorize("@perm.has('recruitment.request.create')")
    @RequirePermission("recruitment.request.create")
    @Operation(summary = "Tạo mới phiếu yêu cầu tuyển dụng")
    public ResponseEntity<ApiResponse<RecruitmentRequestDto.Response>> createRequest(
            @RequestHeader(value = "X-User-Id", required = false) UUID userId,
            @Valid @RequestBody RecruitmentRequestDto.CreateRequest request
    ) {
        UUID requesterId = userId != null ? userId : UUID.randomUUID();
        RecruitmentRequestDto.Response response = requestService.createRequest(requesterId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(response, "Tạo yêu cầu tuyển dụng thành công"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("@perm.has('recruitment.request.create')")
    @RequirePermission("recruitment.request.create")
    @Operation(summary = "Chỉnh sửa phiếu yêu cầu tuyển dụng (Chỉ áp dụng khi DRAFT hoặc REJECTED)")
    public ResponseEntity<ApiResponse<RecruitmentRequestDto.Response>> updateRequest(
            @PathVariable UUID id,
            @Valid @RequestBody RecruitmentRequestDto.UpdateRequest request
    ) {
        RecruitmentRequestDto.Response response = requestService.updateRequest(id, request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Cập nhật yêu cầu tuyển dụng thành công"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("@perm.has('recruitment.request.view')")
    @RequirePermission("recruitment.request.view")
    @Operation(summary = "Xem chi tiết phiếu yêu cầu tuyển dụng")
    public ResponseEntity<ApiResponse<RecruitmentRequestDto.Response>> getRequestById(
            @PathVariable UUID id
    ) {
        RecruitmentRequestDto.Response response = requestService.getRequestById(id);
        return ResponseEntity.ok(ApiResponse.ok(response, "Lấy chi tiết yêu cầu tuyển dụng thành công"));
    }

    @GetMapping
    @PreAuthorize("@perm.has('recruitment.request.view')")
    @RequirePermission("recruitment.request.view")
    @Operation(summary = "Tìm kiếm và phân trang danh sách yêu cầu tuyển dụng")
    public ResponseEntity<ApiResponse<PageData<RecruitmentRequestDto.Response>>> searchRequests(
            @ModelAttribute RecruitmentRequestDto.FilterRequest filter
    ) {
        PageData<RecruitmentRequestDto.Response> response = requestService.searchRequests(filter);
        return ResponseEntity.ok(ApiResponse.ok(response, "Lấy danh sách yêu cầu tuyển dụng thành công"));
    }

    @PostMapping("/{id}/submit")
    @PreAuthorize("@perm.has('recruitment.request.create')")
    @RequirePermission("recruitment.request.create")
    @Operation(summary = "Gửi phiếu yêu cầu tuyển dụng lên cấp phê duyệt")
    public ResponseEntity<ApiResponse<RecruitmentRequestDto.Response>> submitForApproval(
            @PathVariable UUID id
    ) {
        RecruitmentRequestDto.Response response = requestService.submitForApproval(id);
        return ResponseEntity.ok(ApiResponse.ok(response, "Gửi phê duyệt yêu cầu tuyển dụng thành công"));
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("@perm.has('recruitment.request.approve')")
    @RequirePermission("recruitment.request.approve")
    @Operation(summary = "Phê duyệt phiếu yêu cầu tuyển dụng")
    public ResponseEntity<ApiResponse<RecruitmentRequestDto.Response>> approveRequest(
            @PathVariable UUID id
    ) {
        RecruitmentRequestDto.Response response = requestService.approveRequest(id);
        return ResponseEntity.ok(ApiResponse.ok(response, "Phê duyệt yêu cầu tuyển dụng thành công"));
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("@perm.has('recruitment.request.approve')")
    @RequirePermission("recruitment.request.approve")
    @Operation(summary = "Từ chối phiếu yêu cầu tuyển dụng")
    public ResponseEntity<ApiResponse<RecruitmentRequestDto.Response>> rejectRequest(
            @PathVariable UUID id,
            @RequestParam(required = false) String reason
    ) {
        RecruitmentRequestDto.Response response = requestService.rejectRequest(id, reason);
        return ResponseEntity.ok(ApiResponse.ok(response, "Từ chối yêu cầu tuyển dụng thành công"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@perm.has('recruitment.request.create')")
    @RequirePermission("recruitment.request.create")
    @Operation(summary = "Xóa phiếu yêu cầu tuyển dụng")
    public ResponseEntity<ApiResponse<Void>> deleteRequest(@PathVariable UUID id) {
        requestService.deleteRequest(id);
        return ResponseEntity.ok(ApiResponse.noContent("Xóa yêu cầu tuyển dụng thành công"));
    }
}
