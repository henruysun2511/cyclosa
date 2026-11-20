package com.cyclosa.document.controller;

import com.cyclosa.common.annotation.RequirePermission;
import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.common.response.PageData;
import com.cyclosa.common.util.SecurityUtils;
import com.cyclosa.document.dto.DocumentMetadataFieldDto;
import com.cyclosa.document.dto.DocumentTypeDto;
import com.cyclosa.document.service.DocumentTypeService;
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
@RequestMapping("/api/v1/document-types")
@RequiredArgsConstructor
@Tag(name = "Document Types", description = "Quản lý danh mục loại tài liệu và cấu hình trường metadata động")
public class DocumentTypeController {

    private final DocumentTypeService documentTypeService;

    @GetMapping("/simple")
    @PreAuthorize("@perm.has('digital_record.view')")
    @RequirePermission("digital_record.view")
    @Operation(summary = "Lấy danh sách tóm tắt loại tài liệu cho dropdown lựa chọn")
    public ResponseEntity<ApiResponse<List<DocumentTypeDto.SimpleResponse>>> getSimpleList() {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        List<DocumentTypeDto.SimpleResponse> result = documentTypeService.getSimpleList(companyId);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách loại tài liệu thành công"));
    }

    @GetMapping
    @PreAuthorize("@perm.has('digital_record.view')")
    @RequirePermission("digital_record.view")
    @Operation(summary = "Lấy danh sách loại tài liệu có phân trang")
    public ResponseEntity<ApiResponse<PageData<DocumentTypeDto.Response>>> getDocumentTypes(
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        PageData<DocumentTypeDto.Response> result = documentTypeService.getDocumentTypes(companyId, pageable);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách loại tài liệu thành công"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("@perm.has('digital_record.view')")
    @RequirePermission("digital_record.view")
    @Operation(summary = "Xem chi tiết loại tài liệu kèm cấu hình metadata")
    public ResponseEntity<ApiResponse<DocumentTypeDto.Response>> getById(@PathVariable UUID id) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        DocumentTypeDto.Response result = documentTypeService.getById(id, companyId);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy chi tiết loại tài liệu thành công"));
    }

    @PostMapping
    @PreAuthorize("@perm.has('digital_record.manage')")
    @RequirePermission("digital_record.manage")
    @Operation(summary = "Tạo mới loại tài liệu")
    public ResponseEntity<ApiResponse<DocumentTypeDto.Response>> create(
            @Valid @RequestBody DocumentTypeDto.CreateRequest request) {

        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        DocumentTypeDto.Response result = documentTypeService.create(request, companyId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(result, "Tạo mới loại tài liệu thành công"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("@perm.has('digital_record.manage')")
    @RequirePermission("digital_record.manage")
    @Operation(summary = "Cập nhật loại tài liệu")
    public ResponseEntity<ApiResponse<DocumentTypeDto.Response>> update(
            @PathVariable UUID id,
            @Valid @RequestBody DocumentTypeDto.UpdateRequest request) {

        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        DocumentTypeDto.Response result = documentTypeService.update(id, request, companyId);
        return ResponseEntity.ok(ApiResponse.ok(result, "Cập nhật loại tài liệu thành công"));
    }

    @PostMapping("/{id}/fields")
    @PreAuthorize("@perm.has('digital_record.manage')")
    @RequirePermission("digital_record.manage")
    @Operation(summary = "Thêm trường metadata động cho loại tài liệu")
    public ResponseEntity<ApiResponse<DocumentMetadataFieldDto.Response>> addMetadataField(
            @PathVariable UUID id,
            @Valid @RequestBody DocumentMetadataFieldDto.CreateRequest request) {

        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        DocumentMetadataFieldDto.Response result = documentTypeService.addMetadataField(id, request, companyId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(result, "Thêm trường metadata thành công"));
    }

    @DeleteMapping("/{id}/fields/{fieldId}")
    @PreAuthorize("@perm.has('digital_record.manage')")
    @RequirePermission("digital_record.manage")
    @Operation(summary = "Xóa trường metadata động khỏi loại tài liệu")
    public ResponseEntity<ApiResponse<Void>> deleteMetadataField(
            @PathVariable UUID id,
            @PathVariable UUID fieldId) {

        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        documentTypeService.deleteMetadataField(id, fieldId, companyId);
        return ResponseEntity.ok(ApiResponse.ok(null, "Xóa trường metadata thành công"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@perm.has('digital_record.manage')")
    @RequirePermission("digital_record.manage")
    @Operation(summary = "Xóa loại tài liệu")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        documentTypeService.delete(id, companyId);
        return ResponseEntity.ok(ApiResponse.ok(null, "Xóa loại tài liệu thành công"));
    }
}
