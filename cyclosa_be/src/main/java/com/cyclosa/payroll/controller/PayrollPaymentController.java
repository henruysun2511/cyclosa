package com.cyclosa.payroll.controller;

import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.payroll.dto.request.ProcessPaymentResultRequest;
import com.cyclosa.payroll.dto.request.RetryPaymentRequest;
import com.cyclosa.payroll.dto.response.PayrollPaymentResponse;
import com.cyclosa.payroll.service.PayrollPaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/payroll-payments")
@RequiredArgsConstructor
@Tag(name = "Payroll Payments", description = "Quản lý ủy nhiệm chi ngân hàng và theo dõi trạng thái thanh toán lương")
public class PayrollPaymentController {

    private final PayrollPaymentService payrollPaymentService;

    @GetMapping("/period/{periodId}")
    @Operation(summary = "Lấy danh sách chi trả của kỳ lương")
    public ResponseEntity<ApiResponse<List<PayrollPaymentResponse>>> getPaymentsByPeriod(@PathVariable UUID periodId) {
        List<PayrollPaymentResponse> res = payrollPaymentService.getPaymentsByPeriod(periodId);
        return ResponseEntity.ok(ApiResponse.ok(res));
    }

    @PostMapping("/{id}/result")
    @Operation(summary = "Cập nhật kết quả chi trả ngân hàng (Webhook / Manual update)")
    public ResponseEntity<ApiResponse<PayrollPaymentResponse>> processResult(
            @PathVariable UUID id,
            @Valid @RequestBody ProcessPaymentResultRequest request) {
        PayrollPaymentResponse res = payrollPaymentService.processPaymentResult(id, request);
        return ResponseEntity.ok(ApiResponse.ok(res));
    }

    @PostMapping("/retry")
    @Operation(summary = "Thử lại chi trả cho các giao dịch bị lỗi")
    public ResponseEntity<ApiResponse<List<PayrollPaymentResponse>>> retryPayments(
            @Valid @RequestBody RetryPaymentRequest request) {
        List<PayrollPaymentResponse> res = payrollPaymentService.retryPayments(request);
        return ResponseEntity.ok(ApiResponse.ok(res));
    }
}
