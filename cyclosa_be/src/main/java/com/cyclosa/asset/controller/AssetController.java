package com.cyclosa.asset.controller;

import com.cyclosa.asset.dto.request.AssetFilter;
import com.cyclosa.asset.dto.request.AssignAssetRequest;
import com.cyclosa.asset.dto.request.CreateAssetRequest;
import com.cyclosa.asset.dto.request.UpdateAssetRequest;
import com.cyclosa.asset.dto.response.AssetAssignmentResponse;
import com.cyclosa.asset.dto.response.AssetDetailResponse;
import com.cyclosa.asset.dto.response.AssetStatisticsResponse;
import com.cyclosa.asset.dto.response.AssetSummaryResponse;
import com.cyclosa.asset.service.AssetService;
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

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/assets")
@RequiredArgsConstructor
@Tag(name = "Asset Management", description = "Quản lý hiện vật trang thiết bị, tài sản hữu hình doanh nghiệp")
public class AssetController {

    private final AssetService assetService;

    @GetMapping
    @PreAuthorize("@perm.has('asset.view')")
    @RequirePermission("asset.view")
    @Operation(summary = "Lấy danh sách tài sản có phân trang và bộ lọc")
    public ResponseEntity<ApiResponse<PageData<AssetSummaryResponse>>> getAssets(@Valid AssetFilter filter) {
        PageData<AssetSummaryResponse> result = assetService.getAssets(filter);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách tài sản thành công"));
    }

    @GetMapping("/statistics")
    @PreAuthorize("@perm.has('asset.view')")
    @RequirePermission("asset.view")
    @Operation(summary = "Thống kê chỉ số KPI phân hệ tài sản")
    public ResponseEntity<ApiResponse<AssetStatisticsResponse>> getStatistics() {
        AssetStatisticsResponse result = assetService.getStatistics();
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy thống kê tài sản thành công"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("@perm.has('asset.view')")
    @RequirePermission("asset.view")
    @Operation(summary = "Lấy thông tin chi tiết tài sản kèm lịch sử cấp phát")
    public ResponseEntity<ApiResponse<AssetDetailResponse>> getAssetById(@PathVariable UUID id) {
        AssetDetailResponse result = assetService.getAssetById(id);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy chi tiết tài sản thành công"));
    }

    @PostMapping
    @PreAuthorize("@perm.has('asset.manage')")
    @RequirePermission("asset.manage")
    @Operation(summary = "Tạo mới tài sản nhập kho")
    public ResponseEntity<ApiResponse<AssetDetailResponse>> createAsset(@Valid @RequestBody CreateAssetRequest request) {
        AssetDetailResponse result = assetService.createAsset(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(result, "Tạo mới tài sản thành công"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("@perm.has('asset.manage')")
    @RequirePermission("asset.manage")
    @Operation(summary = "Cập nhật thông tin tài sản")
    public ResponseEntity<ApiResponse<AssetDetailResponse>> updateAsset(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateAssetRequest request) {
        AssetDetailResponse result = assetService.updateAsset(id, request);
        return ResponseEntity.ok(ApiResponse.ok(result, "Cập nhật tài sản thành công"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@perm.has('asset.manage')")
    @RequirePermission("asset.manage")
    @Operation(summary = "Xóa tài sản khỏi hệ thống (soft delete)")
    public ResponseEntity<ApiResponse<Void>> deleteAsset(@PathVariable UUID id) {
        assetService.deleteAsset(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Xóa tài sản thành công"));
    }

    @PostMapping("/{id}/assign")
    @PreAuthorize("@perm.has('asset.assign')")
    @RequirePermission("asset.assign")
    @Operation(summary = "Cấp phát tài sản cho nhân viên")
    public ResponseEntity<ApiResponse<AssetAssignmentResponse>> assignAsset(
            @PathVariable UUID id,
            @Valid @RequestBody AssignAssetRequest request) {
        AssetAssignmentResponse result = assetService.assignAsset(id, request);
        return ResponseEntity.ok(ApiResponse.ok(result, "Cấp phát tài sản cho nhân viên thành công"));
    }
}
