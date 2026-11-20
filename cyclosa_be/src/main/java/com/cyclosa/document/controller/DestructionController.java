package com.cyclosa.document.controller;

import com.cyclosa.common.annotation.RequirePermission;
import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.common.response.PageData;
import com.cyclosa.common.util.SecurityUtils;
import com.cyclosa.document.dto.DestructionProposalDto;
import com.cyclosa.document.dto.DocumentDto;
import com.cyclosa.document.dto.request.DestructionProposalFilter;
import com.cyclosa.document.service.DestructionService;
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
@RequestMapping("/api/v1/destruction-proposals")
@RequiredArgsConstructor
@Tag(name = "Document Destruction", description = "Quy trình Hội đồng biểu quyết và tiêu hủy tài liệu hết hạn lưu trữ")
public class DestructionController {

    private final DestructionService destructionService;

    @GetMapping("/candidates")
    @PreAuthorize("@perm.has('digital_record.destroy')")
    @RequirePermission("digital_record.destroy")
    @Operation(summary = "Quét danh sách các tài liệu đã hết hạn lưu trữ đủ điều kiện tiêu hủy")
    public ResponseEntity<ApiResponse<List<DocumentDto.Response>>> getDestructionCandidates() {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        List<DocumentDto.Response> result = destructionService.getDestructionCandidates(companyId);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách tài liệu đủ điều kiện tiêu hủy thành công"));
    }

    @GetMapping
    @PreAuthorize("@perm.has('digital_record.destroy')")
    @RequirePermission("digital_record.destroy")
    @Operation(summary = "Lấy danh sách các đề xuất tiêu hủy có phân trang")
    public ResponseEntity<ApiResponse<PageData<DestructionProposalDto.Response>>> getProposals(@Valid DestructionProposalFilter filter) {
        PageData<DestructionProposalDto.Response> result = destructionService.getProposals(filter);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách đề xuất tiêu hủy thành công"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("@perm.has('digital_record.destroy')")
    @RequirePermission("digital_record.destroy")
    @Operation(summary = "Xem chi tiết đề xuất tiêu hủy kèm danh sách tài liệu và kết quả biểu quyết")
    public ResponseEntity<ApiResponse<DestructionProposalDto.DetailResponse>> getProposalDetail(@PathVariable UUID id) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        DestructionProposalDto.DetailResponse result = destructionService.getProposalDetail(id, companyId);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy chi tiết đề xuất tiêu hủy thành công"));
    }

    @PostMapping
    @PreAuthorize("@perm.has('digital_record.destroy')")
    @RequirePermission("digital_record.destroy")
    @Operation(summary = "Lập đề xuất tiêu hủy và khởi tạo Hội đồng tiêu hủy")
    public ResponseEntity<ApiResponse<DestructionProposalDto.Response>> createProposal(
            @Valid @RequestBody DestructionProposalDto.CreateRequest request) {

        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        DestructionProposalDto.Response result = destructionService.createProposal(request, companyId, currentUserId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(result, "Lập đề xuất tiêu hủy thành công"));
    }

    @PostMapping("/{id}/vote")
    @PreAuthorize("@perm.has('digital_record.destroy')")
    @RequirePermission("digital_record.destroy")
    @Operation(summary = "Thành viên Hội đồng thực hiện biểu quyết (APPROVE / REJECT)")
    public ResponseEntity<ApiResponse<DestructionProposalDto.Response>> vote(
            @PathVariable UUID id,
            @Valid @RequestBody DestructionProposalDto.VoteRequest request) {

        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        DestructionProposalDto.Response result = destructionService.voteProposal(id, request, companyId, currentUserId);
        return ResponseEntity.ok(ApiResponse.ok(result, "Ghi nhận biểu quyết thành công"));
    }

    @PostMapping("/{id}/execute")
    @PreAuthorize("@perm.has('digital_record.destroy')")
    @RequirePermission("digital_record.destroy")
    @Operation(summary = "Thực thi tiêu hủy tài liệu sau khi Hội đồng đồng thuận >= 100%")
    public ResponseEntity<ApiResponse<DestructionProposalDto.Response>> executeDestruction(
            @PathVariable UUID id,
            @Valid @RequestBody DestructionProposalDto.ExecuteRequest request) {

        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        DestructionProposalDto.Response result = destructionService.executeDestruction(id, request, companyId, currentUserId);
        return ResponseEntity.ok(ApiResponse.ok(result, "Thực thi tiêu hủy tài liệu thành công"));
    }
}
