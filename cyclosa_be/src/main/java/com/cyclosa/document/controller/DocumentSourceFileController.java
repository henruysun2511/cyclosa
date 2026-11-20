package com.cyclosa.document.controller;

import com.cyclosa.common.annotation.RequirePermission;
import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.common.util.SecurityUtils;
import com.cyclosa.document.dto.DocumentSourceFileDto;
import com.cyclosa.document.service.DocumentSourceFileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/document-uploads")
@RequiredArgsConstructor
@Tag(name = "Document Uploads & Quality Check", description = "Tiếp nhận tệp scan gốc Gói SIP và kiểm tra tiêu chuẩn số hóa (Thông tư 05/2025/TT-BNV)")
public class DocumentSourceFileController {

    private final DocumentSourceFileService sourceFileService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("@perm.has('digital_record.create')")
    @RequirePermission("digital_record.create")
    @Operation(summary = "Tải lên tệp scan gốc và kiểm tra chất lượng số hóa (>= 300 DPI)")
    public ResponseEntity<ApiResponse<DocumentSourceFileDto.Response>> uploadSourceFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "dpi", required = false, defaultValue = "300") Integer dpi,
            @RequestParam(value = "totalPages", required = false, defaultValue = "1") Integer totalPages,
            @RequestParam(value = "companyId", required = false) UUID companyId) {

        UUID effectiveCompanyId = companyId != null ? companyId : SecurityUtils.getCurrentUserCompanyId();
        UUID currentUserId = SecurityUtils.getCurrentUserId();

        DocumentSourceFileDto.Response result = sourceFileService.uploadSourceFile(
                file, dpi, totalPages, effectiveCompanyId, currentUserId);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(result, "Tiếp nhận và kiểm tra tệp số hóa thành công"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("@perm.has('digital_record.view')")
    @RequirePermission("digital_record.view")
    @Operation(summary = "Xem thông tin kiểm tra chất lượng tệp nguồn SIP")
    public ResponseEntity<ApiResponse<DocumentSourceFileDto.Response>> getById(
            @PathVariable UUID id,
            @RequestParam(value = "companyId", required = false) UUID companyId) {

        UUID effectiveCompanyId = companyId != null ? companyId : SecurityUtils.getCurrentUserCompanyId();
        DocumentSourceFileDto.Response result = sourceFileService.getById(id, effectiveCompanyId);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy thông tin tệp thành công"));
    }
}
