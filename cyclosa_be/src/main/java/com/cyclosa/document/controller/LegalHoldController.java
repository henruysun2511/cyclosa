package com.cyclosa.document.controller;

import com.cyclosa.common.annotation.RequirePermission;
import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.common.response.PageData;
import com.cyclosa.common.util.SecurityUtils;
import com.cyclosa.document.dto.DocumentLegalHoldDto;
import com.cyclosa.document.service.DocumentLegalHoldService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/legal-holds")
@RequiredArgsConstructor
@Tag(name = "Document Legal Holds", description = "Cơ chế tạm giữ pháp lý ngăn chặn tiêu hủy tài liệu khi có tranh chấp, thanh tra hoặc kiểm toán")
public class LegalHoldController {

    private final DocumentLegalHoldService legalHoldService;

    @GetMapping
    @PreAuthorize("@perm.has('digital_record.legal_hold')")
    @RequirePermission("digital_record.legal_hold")
    @Operation(summary = "Lấy danh sách các lệnh tạm giữ pháp lý có phân trang")
    public ResponseEntity<ApiResponse<PageData<DocumentLegalHoldDto.Response>>> getLegalHolds(
            @PageableDefault(sort = "placedAt", direction = Sort.Direction.DESC) Pageable pageable) {

        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        PageData<DocumentLegalHoldDto.Response> result = legalHoldService.getLegalHolds(companyId, pageable);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách lệnh tạm giữ thành công"));
    }

    @GetMapping("/document/{documentId}")
    @PreAuthorize("@perm.has('digital_record.view')")
    @RequirePermission("digital_record.view")
    @Operation(summary = "Lấy lịch sử các lệnh tạm giữ của một tài liệu")
    public ResponseEntity<ApiResponse<List<DocumentLegalHoldDto.Response>>> getHoldsByDocumentId(
            @PathVariable UUID documentId) {

        List<DocumentLegalHoldDto.Response> result = legalHoldService.getHoldsByDocumentId(documentId);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách tạm giữ của tài liệu thành công"));
    }

    @PostMapping("/document/{documentId}")
    @PreAuthorize("@perm.has('digital_record.legal_hold')")
    @RequirePermission("digital_record.legal_hold")
    @Operation(summary = "Ban hành lệnh tạm giữ pháp lý cho tài liệu")
    public ResponseEntity<ApiResponse<DocumentLegalHoldDto.Response>> placeHold(
            @PathVariable UUID documentId,
            @Valid @RequestBody DocumentLegalHoldDto.PlaceHoldRequest request) {

        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        DocumentLegalHoldDto.Response result = legalHoldService.placeHold(documentId, request, companyId, currentUserId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(result, "Ban hành lệnh tạm giữ pháp lý thành công"));
    }

    @PostMapping("/{holdId}/release")
    @PreAuthorize("@perm.has('digital_record.legal_hold')")
    @RequirePermission("digital_record.legal_hold")
    @Operation(summary = "Gỡ bỏ lệnh tạm giữ pháp lý")
    public ResponseEntity<ApiResponse<DocumentLegalHoldDto.Response>> releaseHold(
            @PathVariable UUID holdId,
            @Valid @RequestBody DocumentLegalHoldDto.ReleaseHoldRequest request) {

        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        DocumentLegalHoldDto.Response result = legalHoldService.releaseHold(holdId, request, companyId, currentUserId);
        return ResponseEntity.ok(ApiResponse.ok(result, "Gỡ bỏ lệnh tạm giữ pháp lý thành công"));
    }
}
