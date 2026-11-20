package com.cyclosa.recruitment.controller;

import com.cyclosa.common.annotation.RequirePermission;
import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.common.response.PageData;
import com.cyclosa.recruitment.dto.InternalOpportunityDto;
import com.cyclosa.recruitment.service.InternalOpportunityService;
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
@RequestMapping("/api/v1/recruitment/internal-opportunities")
@RequiredArgsConstructor
@Tag(name = "Internal Opportunity", description = "Quản lý cơ hội tuyển dụng và luân chuyển nội bộ")
public class InternalOpportunityController {

    private final InternalOpportunityService opportunityService;

    @PostMapping
    @PreAuthorize("@perm.has('recruitment.job.manage')")
    @RequirePermission("recruitment.job.manage")
    @Operation(summary = "Mở cơ hội tuyển dụng hoặc luân chuyển nội bộ")
    public ResponseEntity<ApiResponse<InternalOpportunityDto.Response>> createOpportunity(
            @Valid @RequestBody InternalOpportunityDto.CreateRequest request
    ) {
        InternalOpportunityDto.Response response = opportunityService.createOpportunity(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(response, "Khởi tạo cơ hội nội bộ thành công"));
    }

    @PostMapping("/{id}/apply")
    @Operation(summary = "Nhân viên nộp hồ sơ ứng tuyển vào vị trí nội bộ")
    public ResponseEntity<ApiResponse<InternalOpportunityDto.ApplicationResponse>> applyInternal(
            @PathVariable UUID id,
            @Valid @RequestBody InternalOpportunityDto.ApplyRequest request
    ) {
        InternalOpportunityDto.ApplicationResponse response = opportunityService.applyInternal(id, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(response, "Nộp hồ sơ ứng tuyển nội bộ thành công"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Xem chi tiết cơ hội tuyển dụng nội bộ")
    public ResponseEntity<ApiResponse<InternalOpportunityDto.Response>> getOpportunityById(
            @PathVariable UUID id
    ) {
        InternalOpportunityDto.Response response = opportunityService.getOpportunityById(id);
        return ResponseEntity.ok(ApiResponse.ok(response, "Lấy chi tiết cơ hội nội bộ thành công"));
    }

    @GetMapping
    @Operation(summary = "Tìm kiếm và phân trang danh sách cơ hội nội bộ")
    public ResponseEntity<ApiResponse<PageData<InternalOpportunityDto.Response>>> searchOpportunities(
            @ModelAttribute InternalOpportunityDto.FilterRequest filter
    ) {
        PageData<InternalOpportunityDto.Response> response = opportunityService.searchOpportunities(filter);
        return ResponseEntity.ok(ApiResponse.ok(response, "Lấy danh sách cơ hội nội bộ thành công"));
    }

    @GetMapping("/{id}/applications")
    @PreAuthorize("@perm.has('recruitment.job.manage')")
    @RequirePermission("recruitment.job.manage")
    @Operation(summary = "Xem danh sách hồ sơ nhân viên đã ứng tuyển vị trí nội bộ")
    public ResponseEntity<ApiResponse<List<InternalOpportunityDto.ApplicationResponse>>> listApplications(
            @PathVariable UUID id
    ) {
        List<InternalOpportunityDto.ApplicationResponse> response = opportunityService.listApplicationsByOpportunity(id);
        return ResponseEntity.ok(ApiResponse.ok(response, "Lấy danh sách hồ sơ ứng tuyển nội bộ thành công"));
    }
}
