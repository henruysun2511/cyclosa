package com.cyclosa.payroll.controller;

import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.payroll.dto.request.CreateEmployeeSalaryItemRequest;
import com.cyclosa.payroll.dto.request.CreateSalaryComponentRequest;
import com.cyclosa.payroll.dto.request.SalaryComponentFilter;
import com.cyclosa.payroll.dto.request.UpdateSalaryComponentRequest;
import com.cyclosa.payroll.dto.response.EmployeeSalaryItemResponse;
import com.cyclosa.payroll.dto.response.SalaryComponentResponse;
import com.cyclosa.payroll.service.SalaryComponentService;
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
@RequestMapping("/api/v1/salary-components")
@RequiredArgsConstructor
@Tag(name = "Salary Components", description = "Quản lý danh mục cấu phần lương & phụ cấp, khấu trừ")
public class SalaryComponentController {

    private final SalaryComponentService salaryComponentService;

    @GetMapping
    @Operation(summary = "Lấy danh sách cấu phần lương")
    public ResponseEntity<ApiResponse<List<SalaryComponentResponse>>> getComponents(SalaryComponentFilter filter) {
        List<SalaryComponentResponse> res = salaryComponentService.getSalaryComponents(filter);
        return ResponseEntity.ok(ApiResponse.ok(res));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Xem chi tiết cấu phần lương")
    public ResponseEntity<ApiResponse<SalaryComponentResponse>> getComponentById(@PathVariable UUID id) {
        SalaryComponentResponse res = salaryComponentService.getSalaryComponentById(id);
        return ResponseEntity.ok(ApiResponse.ok(res));
    }

    @PostMapping
    @Operation(summary = "Tạo mới cấu phần lương")
    public ResponseEntity<ApiResponse<SalaryComponentResponse>> createComponent(
            @Valid @RequestBody CreateSalaryComponentRequest request) {
        SalaryComponentResponse res = salaryComponentService.createSalaryComponent(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.created(res));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật cấu phần lương")
    public ResponseEntity<ApiResponse<SalaryComponentResponse>> updateComponent(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateSalaryComponentRequest request) {
        SalaryComponentResponse res = salaryComponentService.updateSalaryComponent(id, request);
        return ResponseEntity.ok(ApiResponse.ok(res));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa cấu phần lương")
    public ResponseEntity<ApiResponse<Void>> deleteComponent(@PathVariable UUID id) {
        salaryComponentService.deleteSalaryComponent(id);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    @GetMapping("/employee/{employeeId}")
    @Operation(summary = "Lấy danh sách cấu phần lương gán cho nhân viên")
    public ResponseEntity<ApiResponse<List<EmployeeSalaryItemResponse>>> getEmployeeItems(@PathVariable UUID employeeId) {
        List<EmployeeSalaryItemResponse> res = salaryComponentService.getEmployeeSalaryItems(employeeId);
        return ResponseEntity.ok(ApiResponse.ok(res));
    }

    @PostMapping("/employee")
    @Operation(summary = "Gán cấu phần lương cho nhân viên")
    public ResponseEntity<ApiResponse<EmployeeSalaryItemResponse>> assignItem(
            @Valid @RequestBody CreateEmployeeSalaryItemRequest request) {
        EmployeeSalaryItemResponse res = salaryComponentService.assignSalaryItemToEmployee(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.created(res));
    }

    @DeleteMapping("/employee/{itemId}")
    @Operation(summary = "Gỡ cấu phần lương khỏi nhân viên")
    public ResponseEntity<ApiResponse<Void>> removeItem(@PathVariable UUID itemId) {
        salaryComponentService.removeSalaryItemFromEmployee(itemId);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }
}
