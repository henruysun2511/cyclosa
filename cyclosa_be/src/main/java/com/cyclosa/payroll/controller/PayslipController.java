package com.cyclosa.payroll.controller;

import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.payroll.dto.response.PayslipResponse;
import com.cyclosa.payroll.service.PayslipService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/payslips")
@RequiredArgsConstructor
@Tag(name = "Payslips", description = "Quản lý và xuất phiếu lương điện tử cho nhân viên")
public class PayslipController {

    private final PayslipService payslipService;

    @GetMapping("/period/{periodId}")
    @Operation(summary = "Lấy danh sách phiếu lương theo kỳ lương (HR/Admin xem)")
    public ResponseEntity<ApiResponse<List<PayslipResponse>>> getPayslipsByPeriod(@PathVariable UUID periodId) {
        List<PayslipResponse> res = payslipService.getPayslipsByPeriod(periodId);
        return ResponseEntity.ok(ApiResponse.ok(res));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Xem chi tiết một phiếu lương")
    public ResponseEntity<ApiResponse<PayslipResponse>> getPayslipDetail(@PathVariable UUID id) {
        PayslipResponse res = payslipService.getPayslipDetail(id);
        return ResponseEntity.ok(ApiResponse.ok(res));
    }
}
