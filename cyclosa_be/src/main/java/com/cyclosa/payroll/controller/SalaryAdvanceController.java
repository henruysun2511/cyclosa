package com.cyclosa.payroll.controller;

import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.payroll.dto.request.CreateSalaryAdvanceRequest;
import com.cyclosa.payroll.dto.request.SalaryAdvanceFilter;
import com.cyclosa.payroll.dto.response.SalaryAdvanceResponse;
import com.cyclosa.payroll.service.SalaryAdvanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/salary-advances")
@RequiredArgsConstructor
@Tag(name = "Salary Advances", description = "Quản lý đề nghị tạm ứng lương")
public class SalaryAdvanceController {

    private final SalaryAdvanceService salaryAdvanceService;

    @GetMapping
    @Operation(summary = "Danh sách đơn tạm ứng lương")
    public ResponseEntity<ApiResponse<List<SalaryAdvanceResponse>>> getAdvances(SalaryAdvanceFilter filter) {
        List<SalaryAdvanceResponse> res = salaryAdvanceService.getSalaryAdvances(filter);
        return ResponseEntity.ok(ApiResponse.ok(res));
    }

    @PostMapping
    @Operation(summary = "Tạo đơn đề nghị tạm ứng lương (HR nộp thay hoặc nộp hộ)")
    public ResponseEntity<ApiResponse<SalaryAdvanceResponse>> requestAdvance(
            @Valid @RequestBody CreateSalaryAdvanceRequest request) {
        SalaryAdvanceResponse res = salaryAdvanceService.requestSalaryAdvance(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.created(res));
    }

    @PostMapping("/{id}/approve")
    @Operation(summary = "Phê duyệt đơn tạm ứng")
    public ResponseEntity<ApiResponse<SalaryAdvanceResponse>> approveAdvance(@PathVariable UUID id) {
        SalaryAdvanceResponse res = salaryAdvanceService.approveSalaryAdvance(id);
        return ResponseEntity.ok(ApiResponse.ok(res));
    }

    @PostMapping("/{id}/reject")
    @Operation(summary = "Từ chối đơn tạm ứng")
    public ResponseEntity<ApiResponse<SalaryAdvanceResponse>> rejectAdvance(
            @PathVariable UUID id,
            @RequestBody(required = false) Map<String, String> body) {
        String reason = body != null ? body.get("reason") : "Không đủ điều kiện";
        SalaryAdvanceResponse res = salaryAdvanceService.rejectSalaryAdvance(id, reason);
        return ResponseEntity.ok(ApiResponse.ok(res));
    }

    @PostMapping("/{id}/disburse")
    @Operation(summary = "Xác nhận chi trả tạm ứng và chọn kỳ lương cấn trừ")
    public ResponseEntity<ApiResponse<SalaryAdvanceResponse>> disburseAdvance(
            @PathVariable UUID id,
            @RequestParam(required = false) UUID payrollPeriodId) {
        SalaryAdvanceResponse res = salaryAdvanceService.disburseSalaryAdvance(id, payrollPeriodId);
        return ResponseEntity.ok(ApiResponse.ok(res));
    }
}
