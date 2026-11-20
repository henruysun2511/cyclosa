package com.cyclosa.asset.controller;

import com.cyclosa.asset.dto.request.ReturnAssetRequest;
import com.cyclosa.asset.dto.response.AssetAssignmentResponse;
import com.cyclosa.asset.service.AssetService;
import com.cyclosa.common.annotation.RequirePermission;
import com.cyclosa.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@Tag(name = "Asset Assignment Management", description = "Quản lý cấp phát, bàn giao và thu hồi hoàn trả tài sản")
public class AssetAssignmentController {

    private final AssetService assetService;

    @PostMapping("/api/v1/asset-assignments/{id}/return")
    @PreAuthorize("@perm.has('asset.assign')")
    @RequirePermission("asset.assign")
    @Operation(summary = "Ghi nhận thu hồi / hoàn trả tài sản")
    public ResponseEntity<ApiResponse<AssetAssignmentResponse>> returnAsset(
            @PathVariable UUID id,
            @Valid @RequestBody ReturnAssetRequest request) {
        AssetAssignmentResponse result = assetService.returnAsset(id, request);
        return ResponseEntity.ok(ApiResponse.ok(result, "Ghi nhận hoàn trả tài sản thành công"));
    }

    @GetMapping("/api/v1/asset-assignments/history/{assetId}")
    @PreAuthorize("@perm.has('asset.view')")
    @RequirePermission("asset.view")
    @Operation(summary = "Lấy lịch sử cấp phát của 1 tài sản")
    public ResponseEntity<ApiResponse<List<AssetAssignmentResponse>>> getAssetHistory(@PathVariable UUID assetId) {
        List<AssetAssignmentResponse> result = assetService.getAssetHistory(assetId);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy lịch sử cấp phát tài sản thành công"));
    }

    @GetMapping("/api/v1/employees/{employeeId}/assets")
    @PreAuthorize("@perm.has('asset.view')")
    @RequirePermission("asset.view")
    @Operation(summary = "Lấy danh sách tài sản nhân viên đang giữ và lịch sử bàn giao")
    public ResponseEntity<ApiResponse<List<AssetAssignmentResponse>>> getEmployeeAssets(@PathVariable UUID employeeId) {
        List<AssetAssignmentResponse> result = assetService.getEmployeeAssets(employeeId);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách tài sản nhân viên thành công"));
    }

    @GetMapping("/api/v1/me/assets")
    @Operation(summary = "Cổng nhân viên tự xem danh sách tài sản được cấp cho cá nhân")
    public ResponseEntity<ApiResponse<List<AssetAssignmentResponse>>> getMyAssets() {
        List<AssetAssignmentResponse> result = assetService.getMyAssets();
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách tài sản cá nhân thành công"));
    }
}
