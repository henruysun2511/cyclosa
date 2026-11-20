package com.cyclosa.onboarding.controller;

import com.cyclosa.common.annotation.RequirePermission;
import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.onboarding.dto.ItAccountTypeDto;
import com.cyclosa.onboarding.service.ItAccountTypeService;
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
@RequestMapping("/api/v1/it-account-types")
@RequiredArgsConstructor
@Tag(name = "IT Account Types", description = "Quản lý danh mục loại tài khoản CNTT cho nhân viên")
public class ItAccountTypeController {

    private final ItAccountTypeService service;

    @GetMapping
    @PreAuthorize("@perm.has('onboarding.view')")
    @RequirePermission("onboarding.view")
    @Operation(summary = "Lấy danh sách các loại tài khoản CNTT")
    public ResponseEntity<ApiResponse<List<ItAccountTypeDto.Response>>> getItAccountTypes(
            @RequestParam(required = false) UUID companyId
    ) {
        List<ItAccountTypeDto.Response> list = service.getItAccountTypes(companyId);
        return ResponseEntity.ok(ApiResponse.ok(list, "Lấy danh sách loại tài khoản CNTT thành công"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("@perm.has('onboarding.view')")
    @RequirePermission("onboarding.view")
    @Operation(summary = "Xem chi tiết loại tài khoản CNTT")
    public ResponseEntity<ApiResponse<ItAccountTypeDto.Response>> getById(@PathVariable UUID id) {
        ItAccountTypeDto.Response res = service.getById(id);
        return ResponseEntity.ok(ApiResponse.ok(res, "Lấy thông tin loại tài khoản thành công"));
    }

    @PostMapping
    @PreAuthorize("@perm.has('onboarding.manage')")
    @RequirePermission("onboarding.manage")
    @Operation(summary = "Tạo mới loại tài khoản CNTT")
    public ResponseEntity<ApiResponse<ItAccountTypeDto.Response>> create(
            @Valid @RequestBody ItAccountTypeDto.CreateRequest request
    ) {
        ItAccountTypeDto.Response res = service.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(res, "Tạo mới loại tài khoản CNTT thành công"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("@perm.has('onboarding.manage')")
    @RequirePermission("onboarding.manage")
    @Operation(summary = "Cập nhật loại tài khoản CNTT")
    public ResponseEntity<ApiResponse<ItAccountTypeDto.Response>> update(
            @PathVariable UUID id,
            @Valid @RequestBody ItAccountTypeDto.UpdateRequest request
    ) {
        ItAccountTypeDto.Response res = service.update(id, request);
        return ResponseEntity.ok(ApiResponse.ok(res, "Cập nhật loại tài khoản CNTT thành công"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@perm.has('onboarding.manage')")
    @RequirePermission("onboarding.manage")
    @Operation(summary = "Xóa loại tài khoản CNTT (chưa được tham chiếu)")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.noContent("Xóa loại tài khoản CNTT thành công"));
    }
}

