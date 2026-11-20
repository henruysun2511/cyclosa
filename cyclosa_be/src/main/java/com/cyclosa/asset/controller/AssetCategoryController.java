package com.cyclosa.asset.controller;

import com.cyclosa.asset.dto.request.AssetCategoryFilter;
import com.cyclosa.asset.dto.request.CreateAssetCategoryRequest;
import com.cyclosa.asset.dto.request.UpdateAssetCategoryRequest;
import com.cyclosa.asset.dto.response.AssetCategoryResponse;
import com.cyclosa.asset.service.AssetCategoryService;
import com.cyclosa.common.annotation.RequirePermission;
import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.common.response.PageData;
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
@RequestMapping("/api/v1/asset-categories")
@RequiredArgsConstructor
@Tag(name = "Asset Category Management", description = "Quản lý danh mục loại tài sản, nhóm trang thiết bị doanh nghiệp")
public class AssetCategoryController {

    private final AssetCategoryService categoryService;

    @GetMapping
    @PreAuthorize("@perm.has('asset.view')")
    @RequirePermission("asset.view")
    @Operation(summary = "Lấy danh sách loại tài sản có phân trang và tìm kiếm")
    public ResponseEntity<ApiResponse<PageData<AssetCategoryResponse>>> getCategories(@Valid AssetCategoryFilter filter) {
        PageData<AssetCategoryResponse> result = categoryService.getCategories(filter);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách loại tài sản thành công"));
    }

    @GetMapping("/all")
    @PreAuthorize("@perm.has('asset.view')")
    @RequirePermission("asset.view")
    @Operation(summary = "Lấy toàn bộ danh mục loại tài sản nạp dropdown")
    public ResponseEntity<ApiResponse<List<AssetCategoryResponse>>> getAllCategories() {
        List<AssetCategoryResponse> result = categoryService.getAllCategories();
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh mục loại tài sản thành công"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("@perm.has('asset.view')")
    @RequirePermission("asset.view")
    @Operation(summary = "Lấy thông tin chi tiết loại tài sản")
    public ResponseEntity<ApiResponse<AssetCategoryResponse>> getCategoryById(@PathVariable UUID id) {
        AssetCategoryResponse result = categoryService.getCategoryById(id);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy chi tiết loại tài sản thành công"));
    }

    @PostMapping
    @PreAuthorize("@perm.has('asset.manage')")
    @RequirePermission("asset.manage")
    @Operation(summary = "Tạo mới loại tài sản")
    public ResponseEntity<ApiResponse<AssetCategoryResponse>> createCategory(@Valid @RequestBody CreateAssetCategoryRequest request) {
        AssetCategoryResponse result = categoryService.createCategory(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(result, "Tạo mới loại tài sản thành công"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("@perm.has('asset.manage')")
    @RequirePermission("asset.manage")
    @Operation(summary = "Cập nhật loại tài sản")
    public ResponseEntity<ApiResponse<AssetCategoryResponse>> updateCategory(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateAssetCategoryRequest request) {
        AssetCategoryResponse result = categoryService.updateCategory(id, request);
        return ResponseEntity.ok(ApiResponse.ok(result, "Cập nhật loại tài sản thành công"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@perm.has('asset.manage')")
    @RequirePermission("asset.manage")
    @Operation(summary = "Xóa loại tài sản")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable UUID id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Xóa loại tài sản thành công"));
    }
}
