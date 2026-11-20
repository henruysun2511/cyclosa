package com.cyclosa.document.controller;

import com.cyclosa.common.annotation.RequirePermission;
import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.common.response.PageData;
import com.cyclosa.common.util.SecurityUtils;
import com.cyclosa.document.dto.DossierDto;
import com.cyclosa.document.dto.request.DossierFilter;
import com.cyclosa.document.service.DossierService;
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
@RequestMapping("/api/v1/dossiers")
@RequiredArgsConstructor
@Tag(name = "Dossiers", description = "Quản lý bộ hồ sơ gom nhóm của nhân viên theo mục đích")
public class DossierController {

    private final DossierService dossierService;

    @GetMapping
    @PreAuthorize("@perm.has('digital_record.view')")
    @RequirePermission("digital_record.view")
    @Operation(summary = "Lấy danh sách các bộ hồ sơ có phân trang")
    public ResponseEntity<ApiResponse<PageData<DossierDto.Response>>> getDossiers(@Valid DossierFilter filter) {
        PageData<DossierDto.Response> result = dossierService.getDossiers(filter);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách bộ hồ sơ thành công"));
    }

    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("@perm.has('digital_record.view')")
    @RequirePermission("digital_record.view")
    @Operation(summary = "Lấy danh sách bộ hồ sơ của một nhân viên")
    public ResponseEntity<ApiResponse<List<DossierDto.Response>>> getDossiersByEmployee(
            @PathVariable UUID employeeId) {

        List<DossierDto.Response> result = dossierService.getDossiersByEmployee(employeeId);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách bộ hồ sơ nhân viên thành công"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("@perm.has('digital_record.view')")
    @RequirePermission("digital_record.view")
    @Operation(summary = "Xem chi tiết bộ hồ sơ kèm danh sách tài liệu")
    public ResponseEntity<ApiResponse<DossierDto.DetailResponse>> getById(@PathVariable UUID id) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        DossierDto.DetailResponse result = dossierService.getById(id, companyId);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy chi tiết bộ hồ sơ thành công"));
    }

    @PostMapping
    @PreAuthorize("@perm.has('digital_record.create')")
    @RequirePermission("digital_record.create")
    @Operation(summary = "Khởi tạo bộ hồ sơ mới cho nhân viên")
    public ResponseEntity<ApiResponse<DossierDto.Response>> create(
            @Valid @RequestBody DossierDto.CreateRequest request) {

        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        DossierDto.Response result = dossierService.create(request, companyId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(result, "Tạo bộ hồ sơ thành công"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("@perm.has('digital_record.update')")
    @RequirePermission("digital_record.update")
    @Operation(summary = "Cập nhật bộ hồ sơ")
    public ResponseEntity<ApiResponse<DossierDto.Response>> update(
            @PathVariable UUID id,
            @Valid @RequestBody DossierDto.UpdateRequest request) {

        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        DossierDto.Response result = dossierService.update(id, request, companyId);
        return ResponseEntity.ok(ApiResponse.ok(result, "Cập nhật bộ hồ sơ thành công"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@perm.has('digital_record.delete')")
    @RequirePermission("digital_record.delete")
    @Operation(summary = "Xóa bộ hồ sơ")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        dossierService.delete(id, companyId);
        return ResponseEntity.ok(ApiResponse.noContent("Xóa bộ hồ sơ thành công"));
    }
}
