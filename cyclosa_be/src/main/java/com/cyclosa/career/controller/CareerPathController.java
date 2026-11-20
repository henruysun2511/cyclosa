package com.cyclosa.career.controller;

import com.cyclosa.career.dto.request.CareerPathFilter;
import com.cyclosa.career.dto.request.CreateCareerPathRequest;
import com.cyclosa.career.dto.request.UpdateCareerPathRequest;
import com.cyclosa.career.dto.response.CareerGraphResponse;
import com.cyclosa.career.dto.response.CareerPathResponse;
import com.cyclosa.career.dto.response.CareerStatisticsResponse;
import com.cyclosa.career.service.CareerPathService;
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
@RequestMapping("/api/v1/career-paths")
@RequiredArgsConstructor
@Tag(name = "Career Path Management", description = "Quản lý lộ trình và tuyến thăng tiến nghề nghiệp")
public class CareerPathController {

    private final CareerPathService careerPathService;

    @GetMapping
    @PreAuthorize("@perm.has('career.view')")
    @RequirePermission("career.view")
    @Operation(summary = "Lấy danh sách tuyến thăng tiến chuẩn có phân trang và bộ lọc")
    public ResponseEntity<ApiResponse<PageData<CareerPathResponse>>> getCareerPaths(@Valid CareerPathFilter filter) {
        PageData<CareerPathResponse> result = careerPathService.getCareerPaths(filter);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách tuyến thăng tiến thành công"));
    }

    @GetMapping("/statistics")
    @PreAuthorize("@perm.has('career.view') or @perm.has('succession.view')")
    @Operation(summary = "Lấy các chỉ số KPI thống kê kế hoạch kế nhiệm và nhân tài")
    public ResponseEntity<ApiResponse<CareerStatisticsResponse>> getStatistics() {
        CareerStatisticsResponse result = careerPathService.getStatistics();
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy thống kê chỉ số thành công"));
    }

    @GetMapping("/graph")
    @PreAuthorize("@perm.has('career.view')")
    @RequirePermission("career.view")
    @Operation(summary = "Lấy đồ thị mạng lưới thăng tiến đa chiều")
    public ResponseEntity<ApiResponse<CareerGraphResponse>> getCareerGraph(
            @RequestParam(required = false) UUID fromJobTitleId) {
        CareerGraphResponse result = careerPathService.getCareerGraph(fromJobTitleId);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy đồ thị lộ trình thăng tiến thành công"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("@perm.has('career.view')")
    @RequirePermission("career.view")
    @Operation(summary = "Lấy chi tiết tuyến thăng tiến")
    public ResponseEntity<ApiResponse<CareerPathResponse>> getCareerPathById(@PathVariable UUID id) {
        CareerPathResponse result = careerPathService.getCareerPathById(id);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy chi tiết tuyến thăng tiến thành công"));
    }

    @PostMapping
    @PreAuthorize("@perm.has('career.manage')")
    @RequirePermission("career.manage")
    @Operation(summary = "Tạo mới tuyến thăng tiến chuẩn")
    public ResponseEntity<ApiResponse<CareerPathResponse>> createCareerPath(
            @Valid @RequestBody CreateCareerPathRequest request) {
        CareerPathResponse result = careerPathService.createCareerPath(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(result, "Tạo mới tuyến thăng tiến thành công"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("@perm.has('career.manage')")
    @RequirePermission("career.manage")
    @Operation(summary = "Cập nhật tuyến thăng tiến")
    public ResponseEntity<ApiResponse<CareerPathResponse>> updateCareerPath(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateCareerPathRequest request) {
        CareerPathResponse result = careerPathService.updateCareerPath(id, request);
        return ResponseEntity.ok(ApiResponse.ok(result, "Cập nhật tuyến thăng tiến thành công"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@perm.has('career.manage')")
    @RequirePermission("career.manage")
    @Operation(summary = "Xóa tuyến thăng tiến")
    public ResponseEntity<ApiResponse<Void>> deleteCareerPath(@PathVariable UUID id) {
        careerPathService.deleteCareerPath(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Xóa tuyến thăng tiến thành công"));
    }
}
