package com.cyclosa.transfer.controller;

import com.cyclosa.common.annotation.RequirePermission;
import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.common.response.PageData;
import com.cyclosa.common.util.SecurityUtils;
import com.cyclosa.transfer.dto.request.*;
import com.cyclosa.transfer.dto.response.*;
import com.cyclosa.transfer.service.TransferService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/transfers")
@RequiredArgsConstructor
@Tag(name = "Transfer Management", description = "Quản lý điều chuyển nhân sự, luân chuyển công tác, bổ nhiệm chức vụ và biệt phái")
public class TransferController {

    private final TransferService transferService;

    @GetMapping
    @PreAuthorize("@perm.has('transfer.view')")
    @RequirePermission("transfer.view")
    @Operation(summary = "Lấy danh sách phiếu điều chuyển nhân sự có phân trang và bộ lọc")
    public ResponseEntity<ApiResponse<PageData<TransferSummaryResponse>>> getTransfers(@Valid TransferFilter filter) {
        PageData<TransferSummaryResponse> result = transferService.getTransfers(filter);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách phiếu điều chuyển thành công"));
    }

    @GetMapping("/statistics")
    @PreAuthorize("@perm.has('transfer.view')")
    @RequirePermission("transfer.view")
    @Operation(summary = "Thống kê chỉ số KPI phiếu điều chuyển nhân sự")
    public ResponseEntity<ApiResponse<TransferStatisticsResponse>> getStatistics() {
        TransferStatisticsResponse stats = transferService.getStatistics();
        return ResponseEntity.ok(ApiResponse.ok(stats, "Lấy thống kê chỉ số điều chuyển thành công"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("@perm.has('transfer.view')")
    @RequirePermission("transfer.view")
    @Operation(summary = "Lấy chi tiết phiếu điều chuyển nhân sự (So sánh Trước và Sau)")
    public ResponseEntity<ApiResponse<TransferResponse>> getTransferById(@PathVariable UUID id) {
        TransferResponse response = transferService.getTransferById(id);
        return ResponseEntity.ok(ApiResponse.ok(response, "Lấy chi tiết phiếu điều chuyển thành công"));
    }

    @GetMapping("/employee/{employeeId}/current-snapshot")
    @PreAuthorize("@perm.has('transfer.create')")
    @RequirePermission("transfer.create")
    @Operation(summary = "Lấy dữ liệu công tác hiện tại của nhân sự để tạo phiếu điều chuyển")
    public ResponseEntity<ApiResponse<CurrentWorkSnapshotResponse>> getCurrentSnapshot(@PathVariable UUID employeeId) {
        CurrentWorkSnapshotResponse snapshot = transferService.getCurrentSnapshot(employeeId);
        return ResponseEntity.ok(ApiResponse.ok(snapshot, "Lấy thông tin công tác hiện tại của nhân viên thành công"));
    }

    @PostMapping
    @PreAuthorize("@perm.has('transfer.create')")
    @RequirePermission("transfer.create")
    @Operation(summary = "Tạo mới phiếu điều chuyển nhân sự ở trạng thái Dự thảo (DRAFT)")
    public ResponseEntity<ApiResponse<TransferResponse>> createTransfer(@Valid @RequestBody CreateTransferRequest request) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        TransferResponse response = transferService.createTransfer(request, currentUserId);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.created(response, "Tạo phiếu điều chuyển nhân sự thành công"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("@perm.has('transfer.create')")
    @RequirePermission("transfer.create")
    @Operation(summary = "Chỉnh sửa phiếu điều chuyển khi ở trạng thái Dự thảo (DRAFT)")
    public ResponseEntity<ApiResponse<TransferResponse>> updateTransfer(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateTransferRequest request
    ) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        TransferResponse response = transferService.updateTransfer(id, request, currentUserId);
        return ResponseEntity.ok(ApiResponse.ok(response, "Cập nhật phiếu điều chuyển thành công"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@perm.has('transfer.create')")
    @RequirePermission("transfer.create")
    @Operation(summary = "Xóa phiếu điều chuyển (DRAFT hoặc REJECTED)")
    public ResponseEntity<ApiResponse<Void>> deleteTransfer(@PathVariable UUID id) {
        transferService.deleteTransfer(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Xóa phiếu điều chuyển thành công"));
    }

    @PostMapping("/{id}/submit")
    @PreAuthorize("@perm.has('transfer.create')")
    @RequirePermission("transfer.create")
    @Operation(summary = "Trình duyệt phiếu điều chuyển sang Workflow xét duyệt")
    public ResponseEntity<ApiResponse<TransferResponse>> submitTransfer(@PathVariable UUID id) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        TransferResponse response = transferService.submitTransfer(id, currentUserId);
        return ResponseEntity.ok(ApiResponse.ok(response, "Đã trình phê duyệt phiếu điều chuyển"));
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("@perm.has('transfer.approve')")
    @RequirePermission("transfer.approve")
    @Operation(summary = "Phê duyệt phiếu điều chuyển nhân sự")
    public ResponseEntity<ApiResponse<TransferResponse>> approveTransfer(
            @PathVariable UUID id,
            @RequestBody(required = false) ApproveTransferRequest request
    ) {
        UUID approverId = SecurityUtils.getCurrentUserId();
        TransferResponse response = transferService.approveTransfer(id, request, approverId);
        return ResponseEntity.ok(ApiResponse.ok(response, "Phê duyệt phiếu điều chuyển thành công"));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("@perm.has('transfer.approve')")
    @RequirePermission("transfer.approve")
    @Operation(summary = "Từ chối phiếu điều chuyển kèm lý do")
    public ResponseEntity<ApiResponse<TransferResponse>> rejectTransfer(
            @PathVariable UUID id,
            @Valid @RequestBody RejectTransferRequest request
    ) {
        UUID approverId = SecurityUtils.getCurrentUserId();
        TransferResponse response = transferService.rejectTransfer(id, request, approverId);
        return ResponseEntity.ok(ApiResponse.ok(response, "Đã từ chối phiếu điều chuyển"));
    }

    @PostMapping("/{id}/cancel")
    @PreAuthorize("@perm.has('transfer.create')")
    @RequirePermission("transfer.create")
    @Operation(summary = "Hủy phiếu điều chuyển khi chưa hoàn tất")
    public ResponseEntity<ApiResponse<TransferResponse>> cancelTransfer(@PathVariable UUID id) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        TransferResponse response = transferService.cancelTransfer(id, currentUserId);
        return ResponseEntity.ok(ApiResponse.ok(response, "Đã hủy phiếu điều chuyển"));
    }

    @PostMapping("/{id}/apply")
    @PreAuthorize("@perm.has('transfer.manage')")
    @RequirePermission("transfer.manage")
    @Operation(summary = "Thực thi áp dụng quyết định điều chuyển vào hồ sơ nhân sự (cập nhật WorkAssignment)")
    public ResponseEntity<ApiResponse<TransferResponse>> applyTransfer(@PathVariable UUID id) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        TransferResponse response = transferService.applyTransfer(id, currentUserId);
        return ResponseEntity.ok(ApiResponse.ok(response, "Đã áp dụng quyết định điều chuyển vào hồ sơ nhân sự"));
    }

    @PostMapping("/{id}/temporary/extend")
    @PreAuthorize("@perm.has('transfer.manage')")
    @RequirePermission("transfer.manage")
    @Operation(summary = "Gia hạn thời hạn kết thúc điều chuyển tạm thời / biệt phái")
    public ResponseEntity<ApiResponse<TransferResponse>> extendTemporaryTransfer(
            @PathVariable UUID id,
            @Valid @RequestBody ExtendTemporaryTransferRequest request
    ) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        TransferResponse response = transferService.extendTemporaryTransfer(id, request, currentUserId);
        return ResponseEntity.ok(ApiResponse.ok(response, "Gia hạn thời hạn điều chuyển tạm thời thành công"));
    }

    @PostMapping("/{id}/temporary/return")
    @PreAuthorize("@perm.has('transfer.manage')")
    @RequirePermission("transfer.manage")
    @Operation(summary = "Thực hiện điều chuyển hồi hương về đơn vị cũ sau khi hết hạn biệt phái")
    public ResponseEntity<ApiResponse<TransferResponse>> returnTemporaryTransfer(@PathVariable UUID id) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        TransferResponse response = transferService.returnTemporaryTransfer(id, currentUserId);
        return ResponseEntity.ok(ApiResponse.ok(response, "Đã thực hiện điều chuyển hồi hương về đơn vị cũ thành công"));
    }
}
