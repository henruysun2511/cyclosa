package com.cyclosa.leave.controller;

import com.cyclosa.common.annotation.RequirePermission;
import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.common.response.PageData;
import com.cyclosa.leave.dto.request.CarryOverLeaveRequest;
import com.cyclosa.leave.dto.request.GenerateLeaveBalancesRequest;
import com.cyclosa.leave.dto.request.LeaveBalanceFilter;
import com.cyclosa.leave.dto.request.RecalculateLeaveBalanceRequest;
import com.cyclosa.leave.dto.response.LeaveBalanceResponse;
import com.cyclosa.leave.service.LeaveBalanceService;
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
@Tag(name = "Leave Balances", description = "Quản lý quỹ phép cá nhân, cấp quỹ hàng năm, tính lại và chuyển phép tồn")
public class LeaveBalanceController {

    private final LeaveBalanceService leaveBalanceService;

    @GetMapping("/api/v1/leave-balances")
    @PreAuthorize("@perm.has('leave.view')")
    @RequirePermission("leave.view")
    @Operation(summary = "Tra cứu danh sách quỹ phép nhân viên theo bộ lọc và phân quyền")
    public ResponseEntity<ApiResponse<PageData<LeaveBalanceResponse>>> getLeaveBalances(
            @Valid LeaveBalanceFilter filter) {
        PageData<LeaveBalanceResponse> result = leaveBalanceService.getLeaveBalances(filter);
        return ResponseEntity.ok(ApiResponse.ok(result, "Tra cứu danh sách quỹ phép thành công"));
    }

    @GetMapping("/api/v1/me/leave-balances")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Quỹ phép của tôi theo năm (được cấp, chuyển, đã dùng, chờ duyệt, còn lại)")
    public ResponseEntity<ApiResponse<List<LeaveBalanceResponse>>> getMyLeaveBalances(
            @RequestParam(required = false) Integer year) {
        List<LeaveBalanceResponse> result = leaveBalanceService.getMyBalances(year);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy quỹ phép cá nhân thành công"));
    }

    @GetMapping("/api/v1/employees/{employeeId}/leave-balances")
    @PreAuthorize("@perm.has('leave.view')")
    @RequirePermission("leave.view")
    @Operation(summary = "Xem quỹ phép của một nhân viên theo năm")
    public ResponseEntity<ApiResponse<List<LeaveBalanceResponse>>> getEmployeeLeaveBalances(
            @PathVariable UUID employeeId,
            @RequestParam(required = false) Integer year) {
        List<LeaveBalanceResponse> result = leaveBalanceService.getBalancesByEmployeeAndYear(employeeId, year);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy quỹ phép nhân viên thành công"));
    }

    @PostMapping("/api/v1/leave-balances/generate")
    @PreAuthorize("@perm.has('leave.manage')")
    @RequirePermission("leave.manage")
    @Operation(summary = "Cấp quỹ phép năm cho nhân viên theo chính sách và thâm niên")
    public ResponseEntity<ApiResponse<List<LeaveBalanceResponse>>> generateLeaveBalances(
            @Valid @RequestBody GenerateLeaveBalancesRequest request) {
        List<LeaveBalanceResponse> result = leaveBalanceService.generateBalances(request);
        return ResponseEntity.ok(ApiResponse.ok(result, "Cấp quỹ phép năm thành công"));
    }

    @PostMapping("/api/v1/employees/{employeeId}/leave-balances/recalculate")
    @PreAuthorize("@perm.has('leave.manage')")
    @RequirePermission("leave.manage")
    @Operation(summary = "Tính lại số ngày phép được cấp cho một nhân viên")
    public ResponseEntity<ApiResponse<LeaveBalanceResponse>> recalculateLeaveBalance(
            @PathVariable UUID employeeId,
            @Valid @RequestBody RecalculateLeaveBalanceRequest request) {
        LeaveBalanceResponse result = leaveBalanceService.recalculateBalance(employeeId, request);
        return ResponseEntity.ok(ApiResponse.ok(result, "Tính lại quỹ phép thành công"));
    }

    @PostMapping("/api/v1/leave-balances/carry-over")
    @PreAuthorize("@perm.has('leave.manage')")
    @RequirePermission("leave.manage")
    @Operation(summary = "Kết chuyển phép tồn từ năm trước sang năm sau theo chính sách")
    public ResponseEntity<ApiResponse<List<LeaveBalanceResponse>>> carryOverLeave(
            @Valid @RequestBody CarryOverLeaveRequest request) {
        List<LeaveBalanceResponse> result = leaveBalanceService.carryOverLeave(request);
        return ResponseEntity.ok(ApiResponse.ok(result, "Kết chuyển phép tồn thành công"));
    }
}
