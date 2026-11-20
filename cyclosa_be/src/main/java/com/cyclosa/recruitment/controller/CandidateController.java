package com.cyclosa.recruitment.controller;

import com.cyclosa.common.annotation.RequirePermission;
import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.common.response.PageData;
import com.cyclosa.recruitment.dto.CandidateDto;
import com.cyclosa.recruitment.service.CandidateService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/recruitment/candidates")
@RequiredArgsConstructor
@Tag(name = "Candidate", description = "Quản lý hồ sơ ứng viên & bóc tách CV qua AI")
public class CandidateController {

    private final CandidateService candidateService;

    @PostMapping
    @PreAuthorize("@perm.has('recruitment.candidate.manage')")
    @RequirePermission("recruitment.candidate.manage")
    @Operation(summary = "Tạo mới hồ sơ ứng viên thủ công")
    public ResponseEntity<ApiResponse<CandidateDto.Response>> createCandidate(
            @Valid @RequestBody CandidateDto.CreateRequest request
    ) {
        CandidateDto.Response response = candidateService.createCandidate(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(response, "Thêm ứng viên thành công"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("@perm.has('recruitment.candidate.manage')")
    @RequirePermission("recruitment.candidate.manage")
    @Operation(summary = "Cập nhật thông tin hồ sơ ứng viên")
    public ResponseEntity<ApiResponse<CandidateDto.Response>> updateCandidate(
            @PathVariable UUID id,
            @Valid @RequestBody CandidateDto.UpdateRequest request
    ) {
        CandidateDto.Response response = candidateService.updateCandidate(id, request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Cập nhật ứng viên thành công"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("@perm.has('recruitment.candidate.view')")
    @RequirePermission("recruitment.candidate.view")
    @Operation(summary = "Xem hồ sơ chi tiết ứng viên (kinh nghiệm, học vấn, kỹ năng)")
    public ResponseEntity<ApiResponse<CandidateDto.Response>> getCandidateById(
            @PathVariable UUID id
    ) {
        CandidateDto.Response response = candidateService.getCandidateById(id);
        return ResponseEntity.ok(ApiResponse.ok(response, "Lấy chi tiết ứng viên thành công"));
    }

    @GetMapping
    @PreAuthorize("@perm.has('recruitment.candidate.view')")
    @RequirePermission("recruitment.candidate.view")
    @Operation(summary = "Tìm kiếm và phân trang danh sách ứng viên")
    public ResponseEntity<ApiResponse<PageData<CandidateDto.Response>>> searchCandidates(
            @ModelAttribute CandidateDto.FilterRequest filter
    ) {
        PageData<CandidateDto.Response> response = candidateService.searchCandidates(filter);
        return ResponseEntity.ok(ApiResponse.ok(response, "Lấy danh sách ứng viên thành công"));
    }

    @PostMapping("/{id}/blacklist")
    @PreAuthorize("@perm.has('recruitment.candidate.manage')")
    @RequirePermission("recruitment.candidate.manage")
    @Operation(summary = "Đưa ứng viên vào danh sách đen (Blacklist)")
    public ResponseEntity<ApiResponse<CandidateDto.Response>> blacklistCandidate(
            @PathVariable UUID id,
            @RequestParam String reason
    ) {
        CandidateDto.Response response = candidateService.blacklistCandidate(id, reason);
        return ResponseEntity.ok(ApiResponse.ok(response, "Đã đưa ứng viên vào danh sách đen"));
    }

    @PostMapping("/{id}/unblacklist")
    @PreAuthorize("@perm.has('recruitment.candidate.manage')")
    @RequirePermission("recruitment.candidate.manage")
    @Operation(summary = "Gỡ ứng viên khỏi danh sách đen")
    public ResponseEntity<ApiResponse<CandidateDto.Response>> unblacklistCandidate(
            @PathVariable UUID id
    ) {
        CandidateDto.Response response = candidateService.unblacklistCandidate(id);
        return ResponseEntity.ok(ApiResponse.ok(response, "Đã gỡ ứng viên khỏi danh sách đen"));
    }

    @PostMapping(value = "/parse-cv", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("@perm.has('recruitment.candidate.manage')")
    @RequirePermission("recruitment.candidate.manage")
    @Operation(summary = "Tải lên file CV (PDF/DOCX) để AI tự động trích xuất thông tin hồ sơ")
    public ResponseEntity<ApiResponse<CandidateDto.CreateRequest>> parseCvWithAi(
            @RequestParam("file") MultipartFile file,
            @RequestParam("companyId") UUID companyId
    ) {
        CandidateDto.CreateRequest response = candidateService.parseCvWithAi(file, companyId);
        return ResponseEntity.ok(ApiResponse.ok(response, "Bóc tách thông tin CV bằng AI thành công"));
    }
}
