package com.cyclosa.restructure.controller;

import com.cyclosa.common.annotation.RequirePermission;
import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.common.response.PageData;
import com.cyclosa.restructure.dto.request.*;
import com.cyclosa.restructure.dto.response.*;
import com.cyclosa.restructure.service.OrgRestructureService;
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
@RequestMapping("/api/v1/org-restructuring")
@RequiredArgsConstructor
@Tag(name = "Org Restructuring", description = "Quản lý và mô phỏng tái cơ cấu tổ chức")
public class OrgRestructureController {

    private final OrgRestructureService restructureService;

    // ==========================================
    // 1. QUẢN LÝ KỊCH BẢN (SCENARIOS)
    // ==========================================

    @PostMapping("/scenarios")
    @PreAuthorize("@perm.has('org_restructure.manage')")
    @RequirePermission("org_restructure.manage")
    @Operation(summary = "Tạo mới kịch bản tái cơ cấu", description = "Khởi tạo kịch bản mới và tự động clone snapshot sơ đồ tổ chức thực tế")
    public ResponseEntity<ApiResponse<OrgScenarioResponse>> createScenario(
            @Valid @RequestBody CreateOrgScenarioRequest request
    ) {
        OrgScenarioResponse response = restructureService.createScenario(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(response, "Khởi tạo kịch bản tái cơ cấu thành công"));
    }

    @GetMapping("/scenarios")
    @PreAuthorize("@perm.has('org_restructure.view')")
    @RequirePermission("org_restructure.view")
    @Operation(summary = "Lấy danh sách kịch bản tái cơ cấu", description = "Lọc theo từ khóa, trạng thái, phạm vi có phân trang")
    public ResponseEntity<ApiResponse<PageData<OrgScenarioResponse>>> getScenarios(
            @Valid OrgScenarioFilter filter
    ) {
        PageData<OrgScenarioResponse> response = restructureService.getScenarios(filter);
        return ResponseEntity.ok(ApiResponse.ok(response, "Lấy danh sách kịch bản thành công"));
    }

    @GetMapping("/scenarios/statistics")
    @PreAuthorize("@perm.has('org_restructure.view')")
    @RequirePermission("org_restructure.view")
    @Operation(summary = "Lấy thống kê kịch bản tái cơ cấu")
    public ResponseEntity<ApiResponse<OrgScenarioStatisticsResponse>> getStatistics() {
        OrgScenarioStatisticsResponse response = restructureService.getStatistics();
        return ResponseEntity.ok(ApiResponse.ok(response, "Lấy dữ liệu thống kê thành công"));
    }

    @GetMapping("/scenarios/{id}")
    @PreAuthorize("@perm.has('org_restructure.view')")
    @RequirePermission("org_restructure.view")
    @Operation(summary = "Lấy chi tiết kịch bản tái cơ cấu")
    public ResponseEntity<ApiResponse<OrgScenarioDetailResponse>> getScenarioDetail(
            @PathVariable UUID id
    ) {
        OrgScenarioDetailResponse response = restructureService.getScenarioDetail(id);
        return ResponseEntity.ok(ApiResponse.ok(response, "Lấy chi tiết kịch bản thành công"));
    }

    @PutMapping("/scenarios/{id}")
    @PreAuthorize("@perm.has('org_restructure.manage')")
    @RequirePermission("org_restructure.manage")
    @Operation(summary = "Cập nhật thông tin kịch bản tái cơ cấu")
    public ResponseEntity<ApiResponse<OrgScenarioResponse>> updateScenario(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateOrgScenarioRequest request
    ) {
        OrgScenarioResponse response = restructureService.updateScenario(id, request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Cập nhật kịch bản thành công"));
    }

    @DeleteMapping("/scenarios/{id}")
    @PreAuthorize("@perm.has('org_restructure.manage')")
    @RequirePermission("org_restructure.manage")
    @Operation(summary = "Xóa kịch bản tái cơ cấu (chỉ khi là bản nháp hoặc bị từ chối)")
    public ResponseEntity<ApiResponse<Void>> deleteScenario(
            @PathVariable UUID id
    ) {
        restructureService.deleteScenario(id);
        return ResponseEntity.ok(ApiResponse.noContent("Xóa kịch bản thành công"));
    }

    // ==========================================
    // 2. THAO TÁC CÂY SƠ ĐỒ TỔ CHỨC ẢO (SANDBOX TREE)
    // ==========================================

    @GetMapping("/scenarios/{id}/tree")
    @PreAuthorize("@perm.has('org_restructure.view')")
    @RequirePermission("org_restructure.view")
    @Operation(summary = "Lấy cây sơ đồ tổ chức ảo của kịch bản dạng lồng nhau")
    public ResponseEntity<ApiResponse<List<ScenarioDepartmentTreeNodeResponse>>> getScenarioTree(
            @PathVariable UUID id
    ) {
        List<ScenarioDepartmentTreeNodeResponse> tree = restructureService.getScenarioTree(id);
        return ResponseEntity.ok(ApiResponse.ok(tree, "Lấy cây tổ chức giả lập thành công"));
    }

    @PostMapping("/scenarios/{id}/departments")
    @PreAuthorize("@perm.has('org_restructure.manage')")
    @RequirePermission("org_restructure.manage")
    @Operation(summary = "Thành lập phòng ban mới trong kịch bản")
    public ResponseEntity<ApiResponse<ScenarioDepartmentResponse>> createDepartment(
            @PathVariable UUID id,
            @Valid @RequestBody CreateScenarioDepartmentRequest request
    ) {
        ScenarioDepartmentResponse response = restructureService.createDepartment(id, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(response, "Thành lập phòng ban mới thành công"));
    }

    @PutMapping("/scenarios/{id}/departments/{deptId}")
    @PreAuthorize("@perm.has('org_restructure.manage')")
    @RequirePermission("org_restructure.manage")
    @Operation(summary = "Cập nhật phòng ban trong kịch bản")
    public ResponseEntity<ApiResponse<ScenarioDepartmentResponse>> updateDepartment(
            @PathVariable UUID id,
            @PathVariable UUID deptId,
            @Valid @RequestBody UpdateScenarioDepartmentRequest request
    ) {
        ScenarioDepartmentResponse response = restructureService.updateDepartment(id, deptId, request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Cập nhật phòng ban thành công"));
    }

    @PutMapping("/scenarios/{id}/departments/{deptId}/move")
    @PreAuthorize("@perm.has('org_restructure.manage')")
    @RequirePermission("org_restructure.manage")
    @Operation(summary = "Di chuyển phân cấp phòng ban (Kéo thả Re-parenting)")
    public ResponseEntity<ApiResponse<ScenarioDepartmentResponse>> moveDepartment(
            @PathVariable UUID id,
            @PathVariable UUID deptId,
            @Valid @RequestBody MoveScenarioDepartmentRequest request
    ) {
        ScenarioDepartmentResponse response = restructureService.moveDepartment(id, deptId, request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Di chuyển phòng ban thành công"));
    }

    @PostMapping("/scenarios/{id}/actions/merge")
    @PreAuthorize("@perm.has('org_restructure.manage')")
    @RequirePermission("org_restructure.manage")
    @Operation(summary = "Sáp nhập các phòng ban")
    public ResponseEntity<ApiResponse<Void>> mergeDepartments(
            @PathVariable UUID id,
            @Valid @RequestBody MergeScenarioDepartmentsRequest request
    ) {
        restructureService.mergeDepartments(id, request);
        return ResponseEntity.ok(ApiResponse.noContent("Sáp nhập phòng ban thành công"));
    }

    @PostMapping("/scenarios/{id}/actions/split")
    @PreAuthorize("@perm.has('org_restructure.manage')")
    @RequirePermission("org_restructure.manage")
    @Operation(summary = "Chia tách phòng ban")
    public ResponseEntity<ApiResponse<Void>> splitDepartment(
            @PathVariable UUID id,
            @Valid @RequestBody SplitScenarioDepartmentRequest request
    ) {
        restructureService.splitDepartment(id, request);
        return ResponseEntity.ok(ApiResponse.noContent("Chia tách phòng ban thành công"));
    }

    @PostMapping("/scenarios/{id}/departments/{deptId}/dissolve")
    @PreAuthorize("@perm.has('org_restructure.manage')")
    @RequirePermission("org_restructure.manage")
    @Operation(summary = "Giải thể phòng ban trong kịch bản")
    public ResponseEntity<ApiResponse<Void>> dissolveDepartment(
            @PathVariable UUID id,
            @PathVariable UUID deptId
    ) {
        restructureService.dissolveDepartment(id, deptId);
        return ResponseEntity.ok(ApiResponse.noContent("Giải thể phòng ban thành công"));
    }

    @PostMapping("/scenarios/{id}/actions/reassign-employees")
    @PreAuthorize("@perm.has('org_restructure.manage')")
    @RequirePermission("org_restructure.manage")
    @Operation(summary = "Điều chuyển nhân sự hàng loạt trong kịch bản")
    public ResponseEntity<ApiResponse<Void>> reassignEmployees(
            @PathVariable UUID id,
            @Valid @RequestBody ReassignScenarioEmployeesRequest request
    ) {
        restructureService.reassignEmployees(id, request);
        return ResponseEntity.ok(ApiResponse.noContent("Điều chuyển nhân sự thành công"));
    }

    // ==========================================
    // 3. PHÂN TÍCH WHAT-IF, XUNG ĐỘT & SO SÁNH
    // ==========================================

    @GetMapping("/scenarios/{id}/impact-analysis")
    @PreAuthorize("@perm.has('org_restructure.view')")
    @RequirePermission("org_restructure.view")
    @Operation(summary = "Phân tích tác động What-If (Định biên, Quỹ lương, Span of control)")
    public ResponseEntity<ApiResponse<WhatIfImpactAnalysisResponse>> getWhatIfImpact(
            @PathVariable UUID id
    ) {
        WhatIfImpactAnalysisResponse response = restructureService.getWhatIfImpact(id);
        return ResponseEntity.ok(ApiResponse.ok(response, "Phân tích tác động thành công"));
    }

    @GetMapping("/scenarios/{id}/conflicts")
    @PreAuthorize("@perm.has('org_restructure.view')")
    @RequirePermission("org_restructure.view")
    @Operation(summary = "Quét xung đột & lỗ hổng tổ chức (GAP-01 đến GAP-05)")
    public ResponseEntity<ApiResponse<RestructureConflictResponse>> getConflicts(
            @PathVariable UUID id
    ) {
        RestructureConflictResponse response = restructureService.getConflicts(id);
        return ResponseEntity.ok(ApiResponse.ok(response, "Quét xung đột hoàn tất"));
    }

    @GetMapping("/scenarios/{id}/diff")
    @PreAuthorize("@perm.has('org_restructure.view')")
    @RequirePermission("org_restructure.view")
    @Operation(summary = "So sánh đối chiếu sai khác As-Is vs To-Be")
    public ResponseEntity<ApiResponse<RestructureDiffResponse>> getDiff(
            @PathVariable UUID id
    ) {
        RestructureDiffResponse response = restructureService.getDiff(id);
        return ResponseEntity.ok(ApiResponse.ok(response, "Lấy dữ liệu đối chiếu thành công"));
    }

    // ==========================================
    // 4. PHÊ DUYỆT & THỰC THI (LIFECYCLE)
    // ==========================================

    @PostMapping("/scenarios/{id}/submit")
    @PreAuthorize("@perm.has('org_restructure.manage')")
    @RequirePermission("org_restructure.manage")
    @Operation(summary = "Trình kịch bản lên Ban Lãnh đạo thẩm định")
    public ResponseEntity<ApiResponse<OrgScenarioResponse>> submitScenario(
            @PathVariable UUID id
    ) {
        OrgScenarioResponse response = restructureService.submitScenario(id);
        return ResponseEntity.ok(ApiResponse.ok(response, "Trình phê duyệt kịch bản thành công"));
    }

    @PostMapping("/scenarios/{id}/approve")
    @PreAuthorize("@perm.has('org_restructure.approve')")
    @RequirePermission("org_restructure.approve")
    @Operation(summary = "Ban Lãnh đạo phê duyệt kịch bản tái cơ cấu")
    public ResponseEntity<ApiResponse<OrgScenarioResponse>> approveScenario(
            @PathVariable UUID id
    ) {
        OrgScenarioResponse response = restructureService.approveScenario(id);
        return ResponseEntity.ok(ApiResponse.ok(response, "Phê duyệt kịch bản thành công"));
    }

    @PostMapping("/scenarios/{id}/reject")
    @PreAuthorize("@perm.has('org_restructure.approve')")
    @RequirePermission("org_restructure.approve")
    @Operation(summary = "Từ chối kịch bản kèm lý do hiệu chỉnh")
    public ResponseEntity<ApiResponse<OrgScenarioResponse>> rejectScenario(
            @PathVariable UUID id,
            @Valid @RequestBody RejectOrgScenarioRequest request
    ) {
        OrgScenarioResponse response = restructureService.rejectScenario(id, request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Từ chối kịch bản thành công"));
    }

    @PostMapping("/scenarios/{id}/execute")
    @PreAuthorize("@perm.has('org_restructure.execute')")
    @RequirePermission("org_restructure.execute")
    @Operation(summary = "Thực thi áp dụng kịch bản vào sơ đồ tổ chức thực tế")
    public ResponseEntity<ApiResponse<OrgScenarioResponse>> executeScenario(
            @PathVariable UUID id
    ) {
        OrgScenarioResponse response = restructureService.executeScenario(id);
        return ResponseEntity.ok(ApiResponse.ok(response, "Áp dụng kịch bản vào hệ thống thành công"));
    }
}
