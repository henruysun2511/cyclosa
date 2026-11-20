package com.cyclosa.document.controller;

import com.cyclosa.common.annotation.RequirePermission;
import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.common.response.PageData;
import com.cyclosa.common.util.SecurityUtils;
import com.cyclosa.document.dto.DocumentDto;
import com.cyclosa.document.dto.DocumentVersionDto;
import com.cyclosa.document.dto.request.DocumentFilter;
import com.cyclosa.document.service.DocumentService;
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
@RequestMapping("/api/v1/documents")
@RequiredArgsConstructor
@Tag(name = "Digital Documents", description = "Quản lý kho tài liệu số hóa, thẩm định Split-screen, nộp lưu bất biến và ký số xác thực")
public class DocumentController {

    private final DocumentService documentService;

    @GetMapping
    @PreAuthorize("@perm.has('digital_record.view')")
    @RequirePermission("digital_record.view")
    @Operation(summary = "Lấy danh sách tài liệu số hóa có phân trang & bộ lọc")
    public ResponseEntity<ApiResponse<PageData<DocumentDto.Response>>> getDocuments(@Valid DocumentFilter filter) {
        PageData<DocumentDto.Response> result = documentService.getDocuments(filter);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách tài liệu thành công"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("@perm.has('digital_record.view')")
    @RequirePermission("digital_record.view")
    @Operation(summary = "Xem chi tiết tài liệu phục vụ màn hình Thẩm định Split-screen")
    public ResponseEntity<ApiResponse<DocumentDto.DetailResponse>> getDetailById(@PathVariable UUID id) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        DocumentDto.DetailResponse result = documentService.getDetailById(id, companyId);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy chi tiết tài liệu thành công"));
    }

    @PostMapping
    @PreAuthorize("@perm.has('digital_record.create')")
    @RequirePermission("digital_record.create")
    @Operation(summary = "Khởi tạo tài liệu số hóa mới")
    public ResponseEntity<ApiResponse<DocumentDto.Response>> create(
            @Valid @RequestBody DocumentDto.CreateRequest request) {

        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        DocumentDto.Response result = documentService.create(request, companyId, currentUserId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(result, "Khởi tạo tài liệu số hóa thành công"));
    }

    @PostMapping("/{id}/ocr")
    @PreAuthorize("@perm.has('digital_record.update')")
    @RequirePermission("digital_record.update")
    @Operation(summary = "Kích hoạt bóc tách OCR thông minh qua Cyclosa AI Microservice")
    public ResponseEntity<ApiResponse<DocumentDto.DetailResponse>> performOcr(@PathVariable UUID id) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        DocumentDto.DetailResponse result = documentService.performOcr(id, companyId, currentUserId);
        return ResponseEntity.ok(ApiResponse.ok(result, "Thực hiện OCR và bóc tách dữ liệu thành công"));
    }

    @PostMapping("/{id}/verify")
    @PreAuthorize("@perm.has('digital_record.verify')")
    @RequirePermission("digital_record.verify")
    @Operation(summary = "Thẩm định & xác thực metadata bóc tách (Split-screen Review)")
    public ResponseEntity<ApiResponse<DocumentDto.DetailResponse>> verifyMetadata(
            @PathVariable UUID id,
            @Valid @RequestBody DocumentDto.VerifyMetadataRequest request) {

        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        DocumentDto.DetailResponse result = documentService.verifyMetadata(id, request, companyId, currentUserId);
        return ResponseEntity.ok(ApiResponse.ok(result, "Thẩm định và xác thực metadata thành công"));
    }

    @PostMapping("/{id}/archive")
    @PreAuthorize("@perm.has('digital_record.archive')")
    @RequirePermission("digital_record.archive")
    @Operation(summary = "Phê duyệt nộp lưu kho chính thức (Khóa bất biến & Kích hoạt chính sách bảo quản)")
    public ResponseEntity<ApiResponse<DocumentDto.Response>> archiveDocument(@PathVariable UUID id) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        DocumentDto.Response result = documentService.archiveDocument(id, companyId, currentUserId);
        return ResponseEntity.ok(ApiResponse.ok(result, "Nộp lưu kho chính thức thành công"));
    }

    @PostMapping("/{id}/digitization-sign")
    @PreAuthorize("@perm.has('digital_record.sign')")
    @RequirePermission("digital_record.sign")
    @Operation(summary = "Ký số chứng thực số hóa theo Điều 9 Khoản 6 Thông tư 05/2025/TT-BNV")
    public ResponseEntity<ApiResponse<DocumentDto.DigitizationSignResponse>> digitizationSign(
            @PathVariable UUID id,
            @Valid @RequestBody DocumentDto.DigitizationSignRequest request) {

        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        DocumentDto.DigitizationSignResponse result = documentService.digitizationSign(id, request, companyId, currentUserId);
        return ResponseEntity.ok(ApiResponse.ok(result, "Ký số chứng thực số hóa thành công"));
    }

    @PostMapping("/{id}/versions")
    @PreAuthorize("@perm.has('digital_record.update')")
    @RequirePermission("digital_record.update")
    @Operation(summary = "Tải phiên bản mới thay thế bản scan cũ")
    public ResponseEntity<ApiResponse<DocumentVersionDto.Response>> createVersion(
            @PathVariable UUID id,
            @Valid @RequestBody DocumentVersionDto.CreateVersionRequest request) {

        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        DocumentVersionDto.Response result = documentService.createNewVersion(id, request, companyId, currentUserId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(result, "Thêm phiên bản tài liệu mới thành công"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@perm.has('digital_record.delete')")
    @RequirePermission("digital_record.delete")
    @Operation(summary = "Xóa tài liệu số hóa nháp")
    public ResponseEntity<ApiResponse<Void>> deleteDocument(@PathVariable UUID id) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        documentService.delete(id, companyId, currentUserId);
        return ResponseEntity.ok(ApiResponse.noContent("Xóa tài liệu số hóa thành công"));
    }
}
