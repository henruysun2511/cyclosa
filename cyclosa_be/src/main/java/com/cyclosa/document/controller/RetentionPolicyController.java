package com.cyclosa.document.controller;

import com.cyclosa.common.annotation.RequirePermission;
import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.common.response.PageData;
import com.cyclosa.common.util.SecurityUtils;
import com.cyclosa.document.dto.RetentionPolicyDto;
import com.cyclosa.document.dto.request.RetentionPolicyFilter;
import com.cyclosa.document.service.RetentionPolicyService;
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
@RequestMapping("/api/v1/retention-policies")
@RequiredArgsConstructor
@Tag(name = "Retention Policies", description = "Quản lý chính sách lưu trữ tài liệu theo thời hạn và sự kiện kích hoạt")
public class RetentionPolicyController {

    private final RetentionPolicyService retentionPolicyService;

    @GetMapping
    @PreAuthorize("@perm.has('digital_record.view')")
    @RequirePermission("digital_record.view")
    @Operation(summary = "Lấy danh sách chính sách lưu trữ có phân trang")
    public ResponseEntity<ApiResponse<PageData<RetentionPolicyDto.Response>>> getPolicies(@Valid RetentionPolicyFilter filter) {
        PageData<RetentionPolicyDto.Response> result = retentionPolicyService.getPolicies(filter);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách chính sách lưu trữ thành công"));
    }

    @GetMapping("/active")
    @PreAuthorize("@perm.has('digital_record.view')")
    @RequirePermission("digital_record.view")
    @Operation(summary = "Lấy danh sách chính sách lưu trữ đang hiệu lực")
    public ResponseEntity<ApiResponse<List<RetentionPolicyDto.Response>>> getActivePolicies() {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        List<RetentionPolicyDto.Response> result = retentionPolicyService.getActivePolicies(companyId);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách chính sách hiệu lực thành công"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("@perm.has('digital_record.view')")
    @RequirePermission("digital_record.view")
    @Operation(summary = "Xem chi tiết chính sách lưu trữ")
    public ResponseEntity<ApiResponse<RetentionPolicyDto.Response>> getById(@PathVariable UUID id) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        RetentionPolicyDto.Response result = retentionPolicyService.getById(id, companyId);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy chi tiết chính sách lưu trữ thành công"));
    }

    @PostMapping
    @PreAuthorize("@perm.has('digital_record.create')")
    @RequirePermission("digital_record.create")
    @Operation(summary = "Khởi tạo chính sách lưu trữ mới")
    public ResponseEntity<ApiResponse<RetentionPolicyDto.Response>> create(
            @Valid @RequestBody RetentionPolicyDto.CreateRequest request) {

        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        RetentionPolicyDto.Response result = retentionPolicyService.create(request, companyId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(result, "Tạo chính sách lưu trữ thành công"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("@perm.has('digital_record.update')")
    @RequirePermission("digital_record.update")
    @Operation(summary = "Cập nhật chính sách lưu trữ")
    public ResponseEntity<ApiResponse<RetentionPolicyDto.Response>> update(
            @PathVariable UUID id,
            @Valid @RequestBody RetentionPolicyDto.UpdateRequest request) {

        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        RetentionPolicyDto.Response result = retentionPolicyService.update(id, request, companyId);
        return ResponseEntity.ok(ApiResponse.ok(result, "Cập nhật chính sách lưu trữ thành công"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@perm.has('digital_record.delete')")
    @RequirePermission("digital_record.delete")
    @Operation(summary = "Xóa chính sách lưu trữ")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        retentionPolicyService.delete(id, companyId);
        return ResponseEntity.ok(ApiResponse.noContent("Xóa chính sách lưu trữ thành công"));
    }
}
