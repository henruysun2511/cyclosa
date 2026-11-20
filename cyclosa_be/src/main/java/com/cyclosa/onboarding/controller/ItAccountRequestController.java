package com.cyclosa.onboarding.controller;

import com.cyclosa.common.annotation.RequirePermission;
import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.common.response.PageData;
import com.cyclosa.onboarding.dto.ItAccountRequestDto;
import com.cyclosa.onboarding.service.ItAccountRequestService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/it-account-requests")
@RequiredArgsConstructor
@Tag(name = "IT Account Requests", description = "Hàng đợi cấp phát tài khoản CNTT dành cho bộ phận IT Helpdesk")
public class ItAccountRequestController {

    private final ItAccountRequestService service;

    @GetMapping
    @PreAuthorize("@perm.has('onboarding.it_handle')")
    @RequirePermission("onboarding.it_handle")
    @Operation(summary = "Xem hàng đợi yêu cầu cấp tài khoản CNTT cho IT")
    public ResponseEntity<ApiResponse<PageData<ItAccountRequestDto.Response>>> search(
            @ModelAttribute ItAccountRequestDto.FilterRequest filter
    ) {
        PageData<ItAccountRequestDto.Response> res = service.searchRequests(filter);
        return ResponseEntity.ok(ApiResponse.ok(res, "Lấy danh sách yêu cầu cấp tài khoản thành công"));
    }

    @PostMapping("/{id}/provision")
    @PreAuthorize("@perm.has('onboarding.it_handle')")
    @RequirePermission("onboarding.it_handle")
    @Operation(summary = "IT xác nhận đã cấp tài khoản (nhập định danh username/email)")
    public ResponseEntity<ApiResponse<ItAccountRequestDto.Response>> provision(
            @PathVariable UUID id,
            @Valid @RequestBody ItAccountRequestDto.ProvisionRequest request
    ) {
        ItAccountRequestDto.Response res = service.provision(id, request);
        return ResponseEntity.ok(ApiResponse.ok(res, "Xác nhận cấp tài khoản CNTT thành công"));
    }

    @PostMapping("/{id}/fail")
    @PreAuthorize("@perm.has('onboarding.it_handle')")
    @RequirePermission("onboarding.it_handle")
    @Operation(summary = "IT báo cáo cấp tài khoản thất bại kèm lý do")
    public ResponseEntity<ApiResponse<ItAccountRequestDto.Response>> fail(
            @PathVariable UUID id,
            @Valid @RequestBody ItAccountRequestDto.FailRequest request
    ) {
        ItAccountRequestDto.Response res = service.fail(id, request);
        return ResponseEntity.ok(ApiResponse.ok(res, "Ghi nhận trạng thái thất bại"));
    }
}

