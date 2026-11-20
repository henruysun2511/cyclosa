package com.cyclosa.document.controller;

import com.cyclosa.common.annotation.RequirePermission;
import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.common.util.SecurityUtils;
import com.cyclosa.document.dto.DossierExportRequestDto;
import com.cyclosa.document.service.DossierExportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/dossier-exports")
@RequiredArgsConstructor
@Tag(name = "Dossier Export DIP", description = "Trích xuất và đóng gói hồ sơ có Watermark động (Gói DIP)")
public class DossierExportController {

    private final DossierExportService exportService;

    @PostMapping
    @PreAuthorize("@perm.has('digital_record.export')")
    @RequirePermission("digital_record.export")
    @Operation(summary = "Yêu cầu trích xuất & đóng gói hồ sơ có watermark bảo mật")
    public ResponseEntity<ApiResponse<DossierExportRequestDto.Response>> requestExport(
            @Valid @RequestBody DossierExportRequestDto.CreateRequest request,
            @RequestParam(required = false) UUID companyId) {

        UUID effectiveCompanyId = companyId != null ? companyId : SecurityUtils.getCurrentUserCompanyId();
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        DossierExportRequestDto.Response result = exportService.requestExport(request, effectiveCompanyId, currentUserId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(result, "Yêu cầu trích xuất hồ sơ đã được tiếp nhận"));
    }

    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("@perm.has('digital_record.view')")
    @RequirePermission("digital_record.view")
    @Operation(summary = "Lấy danh sách các yêu cầu xuất hồ sơ của nhân viên")
    public ResponseEntity<ApiResponse<List<DossierExportRequestDto.Response>>> getMyExportRequests(
            @PathVariable UUID employeeId) {

        List<DossierExportRequestDto.Response> result = exportService.getMyExportRequests(employeeId);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách yêu cầu xuất hồ sơ thành công"));
    }
}
