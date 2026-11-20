package com.cyclosa.payroll.controller;

import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.payroll.dto.request.CreatePayrollPeriodRequest;
import com.cyclosa.payroll.dto.request.PayrollPeriodFilter;
import com.cyclosa.payroll.dto.request.UpdatePayrollPeriodRequest;
import com.cyclosa.payroll.dto.response.PayrollPeriodResponse;
import com.cyclosa.payroll.dto.response.PayrollPeriodSummaryResponse;
import com.cyclosa.payroll.dto.response.PayrollPrecheckResponse;
import com.cyclosa.payroll.service.PayrollPeriodService;
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
@RequestMapping("/api/v1/payroll-periods")
@RequiredArgsConstructor
@Tag(name = "Payroll Periods", description = "Quản lý kỳ lương, chạy động cơ tính toán và phê duyệt")
public class PayrollPeriodController {

    private final PayrollPeriodService payrollPeriodService;

    @GetMapping
    @Operation(summary = "Lấy danh sách các kỳ lương")
    public ResponseEntity<ApiResponse<List<PayrollPeriodResponse>>> getPeriods(PayrollPeriodFilter filter) {
        List<PayrollPeriodResponse> res = payrollPeriodService.getPayrollPeriods(filter);
        return ResponseEntity.ok(ApiResponse.ok(res));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Xem chi tiết kỳ lương")
    public ResponseEntity<ApiResponse<PayrollPeriodResponse>> getPeriodById(@PathVariable UUID id) {
        PayrollPeriodResponse res = payrollPeriodService.getPayrollPeriodById(id);
        return ResponseEntity.ok(ApiResponse.ok(res));
    }

    @PostMapping
    @Operation(summary = "Tạo kỳ tính lương mới")
    public ResponseEntity<ApiResponse<PayrollPeriodResponse>> createPeriod(
            @Valid @RequestBody CreatePayrollPeriodRequest request) {
        PayrollPeriodResponse res = payrollPeriodService.createPayrollPeriod(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.created(res));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật kỳ tính lương")
    public ResponseEntity<ApiResponse<PayrollPeriodResponse>> updatePeriod(
            @PathVariable UUID id,
            @Valid @RequestBody UpdatePayrollPeriodRequest request) {
        PayrollPeriodResponse res = payrollPeriodService.updatePayrollPeriod(id, request);
        return ResponseEntity.ok(ApiResponse.ok(res));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa kỳ lương (khi còn ở DRAFT/OPEN)")
    public ResponseEntity<ApiResponse<Void>> deletePeriod(@PathVariable UUID id) {
        payrollPeriodService.deletePayrollPeriod(id);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    @GetMapping("/{id}/precheck")
    @Operation(summary = "Kiểm tra tính sẵn sàng trước khi tính lương")
    public ResponseEntity<ApiResponse<PayrollPrecheckResponse>> precheck(@PathVariable UUID id) {
        PayrollPrecheckResponse res = payrollPeriodService.precheckPayroll(id);
        return ResponseEntity.ok(ApiResponse.ok(res));
    }

    @PostMapping("/{id}/calculate")
    @Operation(summary = "Kích hoạt động cơ tính toán lương tự động hàng loạt cho kỳ lương")
    public ResponseEntity<ApiResponse<PayrollPeriodResponse>> calculate(@PathVariable UUID id) {
        PayrollPeriodResponse res = payrollPeriodService.calculatePayroll(id);
        return ResponseEntity.ok(ApiResponse.ok(res));
    }

    @GetMapping("/{id}/summary")
    @Operation(summary = "Tóm tắt điều hành, so sánh kỳ trước và danh sách cảnh báo bất thường")
    public ResponseEntity<ApiResponse<PayrollPeriodSummaryResponse>> getSummary(@PathVariable UUID id) {
        PayrollPeriodSummaryResponse res = payrollPeriodService.getSummary(id);
        return ResponseEntity.ok(ApiResponse.ok(res));
    }

    @PostMapping("/{id}/submit")
    @Operation(summary = "Trình duyệt bảng lương (chuyển sang PENDING_APPROVAL và khóa chỉnh sửa)")
    public ResponseEntity<ApiResponse<PayrollPeriodResponse>> submit(@PathVariable UUID id) {
        PayrollPeriodResponse res = payrollPeriodService.submitForApproval(id);
        return ResponseEntity.ok(ApiResponse.ok(res));
    }

    @PostMapping("/{id}/approve")
    @Operation(summary = "Phê duyệt bảng lương (sinh lệnh chi trả ngân hàng và phiếu lương)")
    public ResponseEntity<ApiResponse<PayrollPeriodResponse>> approve(@PathVariable UUID id) {
        PayrollPeriodResponse res = payrollPeriodService.approvePayroll(id);
        return ResponseEntity.ok(ApiResponse.ok(res));
    }

    @PostMapping("/{id}/reject")
    @Operation(summary = "Từ chối duyệt bảng lương (trả về OPEN để chỉnh sửa)")
    public ResponseEntity<ApiResponse<PayrollPeriodResponse>> reject(
            @PathVariable UUID id,
            @RequestBody(required = false) Map<String, String> body) {
        String reason = body != null ? body.get("reason") : "Bảng lương chưa chính xác";
        PayrollPeriodResponse res = payrollPeriodService.rejectPayroll(id, reason);
        return ResponseEntity.ok(ApiResponse.ok(res));
    }

    @PostMapping("/{id}/lock")
    @Operation(summary = "Khóa sổ kỳ lương sau khi hoàn tất thanh toán")
    public ResponseEntity<ApiResponse<PayrollPeriodResponse>> lock(@PathVariable UUID id) {
        PayrollPeriodResponse res = payrollPeriodService.lockPeriod(id);
        return ResponseEntity.ok(ApiResponse.ok(res));
    }
}
