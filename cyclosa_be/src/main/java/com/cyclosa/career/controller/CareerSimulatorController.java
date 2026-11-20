package com.cyclosa.career.controller;

import com.cyclosa.career.dto.request.SaveSimulationRequest;
import com.cyclosa.career.dto.request.SimulateCareerRequest;
import com.cyclosa.career.dto.response.CareerPathResponse;
import com.cyclosa.career.dto.response.CareerSimulationDetailResponse;
import com.cyclosa.career.dto.response.CareerSimulationResponse;
import com.cyclosa.career.dto.response.SimilarProfileResponse;
import com.cyclosa.career.service.CareerSimulatorService;
import com.cyclosa.common.response.ApiResponse;
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
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "Career Simulator", description = "Mô phỏng lộ trình công danh và kịch bản cá nhân")
public class CareerSimulatorController {

    private final CareerSimulatorService careerSimulatorService;

    @GetMapping("/career-simulator/paths")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Lấy các lộ trình khả dụng từ vị trí hiện tại")
    public ResponseEntity<ApiResponse<List<CareerPathResponse>>> getAvailablePaths() {
        List<CareerPathResponse> result = careerSimulatorService.getAvailablePaths();
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy lộ trình khả dụng thành công"));
    }

    @PostMapping("/career-simulator/simulate")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Mô phỏng lộ trình thăng tiến (tính toán tỉ lệ tương thích)")
    public ResponseEntity<ApiResponse<CareerSimulationDetailResponse>> simulateCareer(
            @Valid @RequestBody SimulateCareerRequest request) {
        CareerSimulationDetailResponse result = careerSimulatorService.simulateCareer(request);
        return ResponseEntity.ok(ApiResponse.ok(result, "Mô phỏng lộ trình thành công"));
    }

    @GetMapping("/career-simulator/similar-profiles")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Lấy danh sách hồ sơ tương đồng đã thăng tiến thành công (dữ liệu ẩn danh)")
    public ResponseEntity<ApiResponse<List<SimilarProfileResponse>>> getSimilarProfiles() {
        List<SimilarProfileResponse> result = careerSimulatorService.getSimilarProfiles();
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy hồ sơ tương đồng thành công"));
    }

    @PostMapping("/career-simulations")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Lưu lại kịch bản mô phỏng cá nhân")
    public ResponseEntity<ApiResponse<CareerSimulationDetailResponse>> saveSimulation(
            @Valid @RequestBody SaveSimulationRequest request) {
        CareerSimulationDetailResponse result = careerSimulatorService.saveSimulation(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(result, "Lưu kịch bản mô phỏng thành công"));
    }

    @GetMapping("/career-simulations")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Lấy danh sách kịch bản mô phỏng đã lưu của cá nhân")
    public ResponseEntity<ApiResponse<List<CareerSimulationResponse>>> getMySimulations() {
        List<CareerSimulationResponse> result = careerSimulatorService.getMySimulations();
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách kịch bản thành công"));
    }

    @GetMapping("/career-simulations/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Xem chi tiết kịch bản mô phỏng cá nhân")
    public ResponseEntity<ApiResponse<CareerSimulationDetailResponse>> getSimulationDetail(@PathVariable UUID id) {
        CareerSimulationDetailResponse result = careerSimulatorService.getSimulationDetail(id);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy chi tiết kịch bản thành công"));
    }

    @DeleteMapping("/career-simulations/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Xóa kịch bản mô phỏng cá nhân")
    public ResponseEntity<ApiResponse<Void>> deleteSimulation(@PathVariable UUID id) {
        careerSimulatorService.deleteSimulation(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Xóa kịch bản thành công"));
    }
}
