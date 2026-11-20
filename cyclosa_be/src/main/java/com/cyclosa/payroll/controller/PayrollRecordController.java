package com.cyclosa.payroll.controller;

import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.payroll.dto.request.ManualAdjustmentRequest;
import com.cyclosa.payroll.dto.response.PayrollRecordDetailResponse;
import com.cyclosa.payroll.dto.response.PayrollRecordResponse;
import com.cyclosa.payroll.service.PayrollRecordService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/payroll-records")
@RequiredArgsConstructor
@Tag(name = "Payroll Records", description = "Ma trận bảng lương chi tiết và điều chỉnh thủ công có audit log")
public class PayrollRecordController {

    private final PayrollRecordService payrollRecordService;

    @GetMapping("/period/{periodId}")
    @Operation(summary = "Lấy danh sách bản ghi bảng lương của một kỳ")
    public ResponseEntity<ApiResponse<List<PayrollRecordResponse>>> getRecordsByPeriod(@PathVariable UUID periodId) {
        List<PayrollRecordResponse> res = payrollRecordService.getRecordsByPeriod(periodId);
        return ResponseEntity.ok(ApiResponse.ok(res));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Xem chi tiết một bản ghi bảng lương (kèm tất cả các dòng chi tiết thu nhập, thuế, bảo hiểm)")
    public ResponseEntity<ApiResponse<PayrollRecordDetailResponse>> getRecordDetail(@PathVariable UUID id) {
        PayrollRecordDetailResponse res = payrollRecordService.getRecordDetail(id);
        return ResponseEntity.ok(ApiResponse.ok(res));
    }

    @PostMapping("/{id}/adjust")
    @Operation(summary = "Điều chỉnh thủ công dòng lương (bắt buộc nhập lý do)")
    public ResponseEntity<ApiResponse<PayrollRecordDetailResponse>> manualAdjust(
            @PathVariable UUID id,
            @Valid @RequestBody ManualAdjustmentRequest request) {
        PayrollRecordDetailResponse res = payrollRecordService.manualAdjustLine(id, request);
        return ResponseEntity.ok(ApiResponse.ok(res));
    }
}
