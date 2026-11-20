package com.cyclosa.career.controller;

import com.cyclosa.career.dto.request.AddTalentPoolEntryRequest;
import com.cyclosa.career.dto.request.TalentPoolFilter;
import com.cyclosa.career.dto.response.NineBoxGridResponse;
import com.cyclosa.career.dto.response.TalentPoolEntryResponse;
import com.cyclosa.career.service.TalentPoolService;
import com.cyclosa.common.annotation.RequirePermission;
import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.common.response.PageData;
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
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "Internal Talent Pool", description = "Quản lý kho nhân tài nội bộ và ma trận 9-Box Grid")
public class InternalTalentPoolController {

    private final TalentPoolService talentPoolService;

    @GetMapping("/internal-talent-pool")
    @PreAuthorize("@perm.has('succession.view')")
    @RequirePermission("succession.view")
    @Operation(summary = "Lấy danh sách nhân tài nội bộ có phân trang và bộ lọc")
    public ResponseEntity<ApiResponse<PageData<TalentPoolEntryResponse>>> getTalentPoolEntries(@Valid TalentPoolFilter filter) {
        PageData<TalentPoolEntryResponse> result = talentPoolService.getTalentPoolEntries(filter);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách nhân tài thành công"));
    }

    @GetMapping("/internal-talent-pool/nine-box-grid")
    @PreAuthorize("@perm.has('succession.view')")
    @RequirePermission("succession.view")
    @Operation(summary = "Lấy dữ liệu trực quan hóa Ma trận 9-Box Grid")
    public ResponseEntity<ApiResponse<NineBoxGridResponse>> getNineBoxGrid() {
        NineBoxGridResponse result = talentPoolService.getNineBoxGrid();
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy dữ liệu ma trận 9 ô thành công"));
    }

    @PostMapping("/internal-talent-pool")
    @PreAuthorize("@perm.has('succession.manage')")
    @RequirePermission("succession.manage")
    @Operation(summary = "Gắn thẻ nhân tài cho nhân viên")
    public ResponseEntity<ApiResponse<TalentPoolEntryResponse>> addTalentPoolEntry(
            @Valid @RequestBody AddTalentPoolEntryRequest request) {
        TalentPoolEntryResponse result = talentPoolService.addTalentPoolEntry(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(result, "Gắn thẻ nhân tài thành công"));
    }

    @DeleteMapping("/internal-talent-pool/{id}")
    @PreAuthorize("@perm.has('succession.manage')")
    @RequirePermission("succession.manage")
    @Operation(summary = "Thu hồi thẻ nhân tài")
    public ResponseEntity<ApiResponse<Void>> removeTalentPoolEntry(@PathVariable UUID id) {
        talentPoolService.removeTalentPoolEntry(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Thu hồi thẻ nhân tài thành công"));
    }

    @GetMapping("/employees/{employeeId}/talent-tags")
    @PreAuthorize("@perm.has('succession.view')")
    @RequirePermission("succession.view")
    @Operation(summary = "Lấy danh sách thẻ nhân tài của một nhân viên")
    public ResponseEntity<ApiResponse<List<TalentPoolEntryResponse>>> getEmployeeTalentTags(@PathVariable UUID employeeId) {
        List<TalentPoolEntryResponse> result = talentPoolService.getEmployeeTalentTags(employeeId);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách thẻ nhân tài của nhân viên thành công"));
    }
}
