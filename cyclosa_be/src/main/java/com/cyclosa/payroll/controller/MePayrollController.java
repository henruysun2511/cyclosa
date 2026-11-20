package com.cyclosa.payroll.controller;

import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.payroll.dto.request.CreateSalaryAdvanceRequest;
import com.cyclosa.payroll.dto.response.PayslipResponse;
import com.cyclosa.payroll.dto.response.SalaryAdvanceResponse;
import com.cyclosa.payroll.service.PayslipService;
import com.cyclosa.payroll.service.SalaryAdvanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/me/payroll")
@RequiredArgsConstructor
@Tag(name = "Employee Payroll ESS", description = "Cổng nhân viên tự xem phiếu lương và nộp đơn tạm ứng lương")
public class MePayrollController {

    private final PayslipService payslipService;
    private final SalaryAdvanceService salaryAdvanceService;

    @GetMapping("/payslips")
    @Operation(summary = "Xem lịch sử phiếu lương của cá nhân tôi")
    public ResponseEntity<ApiResponse<List<PayslipResponse>>> getMyPayslips() {
        List<PayslipResponse> res = payslipService.getMyPayslips();
        return ResponseEntity.ok(ApiResponse.ok(res));
    }

    @GetMapping("/payslips/{id}")
    @Operation(summary = "Xem chi tiết phiếu lương của cá nhân tôi")
    public ResponseEntity<ApiResponse<PayslipResponse>> getMyPayslipDetail(@PathVariable UUID id) {
        PayslipResponse res = payslipService.getPayslipDetail(id);
        return ResponseEntity.ok(ApiResponse.ok(res));
    }

    @GetMapping("/advances")
    @Operation(summary = "Xem lịch sử các đơn tạm ứng lương của tôi")
    public ResponseEntity<ApiResponse<List<SalaryAdvanceResponse>>> getMyAdvances() {
        List<SalaryAdvanceResponse> res = salaryAdvanceService.getMySalaryAdvances();
        return ResponseEntity.ok(ApiResponse.ok(res));
    }

    @PostMapping("/advances")
    @Operation(summary = "Nộp đơn đề nghị tạm ứng lương cá nhân")
    public ResponseEntity<ApiResponse<SalaryAdvanceResponse>> requestMyAdvance(
            @Valid @RequestBody CreateSalaryAdvanceRequest request) {
        SalaryAdvanceResponse res = salaryAdvanceService.requestSalaryAdvance(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.created(res));
    }
}
