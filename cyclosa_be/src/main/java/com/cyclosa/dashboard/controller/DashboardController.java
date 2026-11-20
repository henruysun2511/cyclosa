package com.cyclosa.dashboard.controller;

import com.cyclosa.common.annotation.RequirePermission;
import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.dashboard.dto.request.DashboardFilterDto;
import com.cyclosa.dashboard.dto.response.*;
import com.cyclosa.dashboard.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
@Tag(name = "Centralized Dashboards", description = "Các API phân tích và tổng hợp số liệu cho 7 phân hệ Dashboard tập trung")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/overview")
    @PreAuthorize("@perm.has('dashboard.executive.view')")
    @RequirePermission("dashboard.executive.view")
    @Operation(summary = "Số liệu Dashboard Tổng quan Điều hành (BOD / C-Level)")
    public ResponseEntity<ApiResponse<ExecutiveDashboardResponse>> getExecutiveDashboard(
            @Valid DashboardFilterDto filter) {
        ExecutiveDashboardResponse response = dashboardService.getExecutiveDashboard(filter);
        return ResponseEntity.ok(ApiResponse.ok(response, "Lấy dữ liệu Dashboard Tổng quan thành công"));
    }

    @GetMapping("/personnel")
    @PreAuthorize("@perm.has('dashboard.personnel.view')")
    @RequirePermission("dashboard.personnel.view")
    @Operation(summary = "Số liệu Dashboard Nhân sự & Hợp đồng lao động")
    public ResponseEntity<ApiResponse<PersonnelDashboardResponse>> getPersonnelDashboard(
            @Valid DashboardFilterDto filter) {
        PersonnelDashboardResponse response = dashboardService.getPersonnelDashboard(filter);
        return ResponseEntity.ok(ApiResponse.ok(response, "Lấy dữ liệu Dashboard Nhân sự thành công"));
    }

    @GetMapping("/attendance")
    @PreAuthorize("@perm.has('dashboard.attendance.view')")
    @RequirePermission("dashboard.attendance.view")
    @Operation(summary = "Số liệu Dashboard Chấm công, Ca kíp & Giờ làm thêm OT")
    public ResponseEntity<ApiResponse<AttendanceDashboardResponse>> getAttendanceDashboard(
            @Valid DashboardFilterDto filter) {
        AttendanceDashboardResponse response = dashboardService.getAttendanceDashboard(filter);
        return ResponseEntity.ok(ApiResponse.ok(response, "Lấy dữ liệu Dashboard Chấm công thành công"));
    }

    @GetMapping("/recruitment")
    @PreAuthorize("@perm.has('dashboard.recruitment.view')")
    @RequirePermission("dashboard.recruitment.view")
    @Operation(summary = "Số liệu Dashboard Tuyển dụng & Onboarding thử việc")
    public ResponseEntity<ApiResponse<RecruitmentDashboardResponse>> getRecruitmentDashboard(
            @Valid DashboardFilterDto filter) {
        RecruitmentDashboardResponse response = dashboardService.getRecruitmentDashboard(filter);
        return ResponseEntity.ok(ApiResponse.ok(response, "Lấy dữ liệu Dashboard Tuyển dụng thành công"));
    }

    @GetMapping("/performance")
    @PreAuthorize("@perm.has('dashboard.performance.view')")
    @RequirePermission("dashboard.performance.view")
    @Operation(summary = "Số liệu Dashboard Đánh giá năng lực & Chuông phân phối Gauss")
    public ResponseEntity<ApiResponse<PerformanceDashboardResponse>> getPerformanceDashboard(
            @Valid DashboardFilterDto filter) {
        PerformanceDashboardResponse response = dashboardService.getPerformanceDashboard(filter);
        return ResponseEntity.ok(ApiResponse.ok(response, "Lấy dữ liệu Dashboard Đánh giá thành công"));
    }

    @GetMapping("/workplace")
    @PreAuthorize("@perm.has('dashboard.workplace.view')")
    @RequirePermission("dashboard.workplace.view")
    @Operation(summary = "Số liệu Dashboard Lấp đầy chỗ ngồi & Tài sản thiết bị")
    public ResponseEntity<ApiResponse<WorkplaceDashboardResponse>> getWorkplaceDashboard(
            @Valid DashboardFilterDto filter) {
        WorkplaceDashboardResponse response = dashboardService.getWorkplaceDashboard(filter);
        return ResponseEntity.ok(ApiResponse.ok(response, "Lấy dữ liệu Dashboard Không gian thành công"));
    }
}
