package com.cyclosa.reward.controller;

import com.cyclosa.audit.aop.Auditable;
import com.cyclosa.audit.enums.AuditAction;
import com.cyclosa.common.annotation.RequirePermission;
import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.common.response.PageData;
import com.cyclosa.reward.dto.request.*;
import com.cyclosa.reward.dto.response.*;
import com.cyclosa.reward.service.DisciplineCaseService;
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
@Tag(name = "Discipline Cases", description = "Quản lý hồ sơ vi phạm và kỷ luật lao động")
public class DisciplineCaseController {

    private final DisciplineCaseService disciplineCaseService;

    @GetMapping("/discipline-cases")
    @PreAuthorize("@perm.has('discipline.view')")
    @RequirePermission("discipline.view")
    @Operation(summary = "Lấy danh sách hồ sơ kỷ luật", description = "Lọc theo nhân viên, trạng thái, hình thức kỷ luật có phân trang")
    public ResponseEntity<ApiResponse<PageData<DisciplineCaseResponse>>> getDisciplineCases(@Valid DisciplineCaseFilter filter) {
        PageData<DisciplineCaseResponse> result = disciplineCaseService.getDisciplineCases(filter);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách hồ sơ kỷ luật thành công"));
    }

    @GetMapping("/discipline-cases/{caseId}")
    @PreAuthorize("@perm.has('discipline.view')")
    @RequirePermission("discipline.view")
    @Operation(summary = "Xem chi tiết hồ sơ kỷ luật", description = "Bao gồm căn cứ nội quy, biên bản họp, thành phần tham dự và danh sách bằng chứng")
    public ResponseEntity<ApiResponse<DisciplineCaseDetailResponse>> getDisciplineCaseById(@PathVariable UUID caseId) {
        DisciplineCaseDetailResponse result = disciplineCaseService.getDisciplineCaseById(caseId);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy chi tiết hồ sơ kỷ luật thành công"));
    }

    @PostMapping("/discipline-cases")
    @PreAuthorize("@perm.has('discipline.manage')")
    @RequirePermission("discipline.manage")
    @Auditable(action = AuditAction.CREATE, entityType = "DISCIPLINE_CASE", description = "Mở hồ sơ vi phạm kỷ luật mới")
    @Operation(summary = "Mở hồ sơ vi phạm kỷ luật mới", description = "Khởi tạo hồ sơ ở trạng thái DRAFT")
    public ResponseEntity<ApiResponse<DisciplineCaseResponse>> createDisciplineCase(@Valid @RequestBody CreateDisciplineCaseRequest request) {
        DisciplineCaseResponse result = disciplineCaseService.createDisciplineCase(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(result, "Mở hồ sơ vi phạm thành công"));
    }

    @PutMapping("/discipline-cases/{caseId}")
    @PreAuthorize("@perm.has('discipline.manage')")
    @RequirePermission("discipline.manage")
    @Auditable(action = AuditAction.UPDATE, entityType = "DISCIPLINE_CASE", description = "Cập nhật hồ sơ kỷ luật")
    @Operation(summary = "Cập nhật hồ sơ kỷ luật", description = "Chỉ cho phép khi hồ sơ đang ở trạng thái DRAFT")
    public ResponseEntity<ApiResponse<DisciplineCaseResponse>> updateDisciplineCase(
            @PathVariable UUID caseId,
            @Valid @RequestBody UpdateDisciplineCaseRequest request) {
        DisciplineCaseResponse result = disciplineCaseService.updateDisciplineCase(caseId, request);
        return ResponseEntity.ok(ApiResponse.ok(result, "Cập nhật hồ sơ kỷ luật thành công"));
    }

    @GetMapping("/discipline-cases/{caseId}/eligibility")
    @PreAuthorize("@perm.has('discipline.manage')")
    @RequirePermission("discipline.manage")
    @Operation(summary = "Thẩm định điều kiện và thời hiệu xử lý kỷ luật", description = "Kiểm tra thời hiệu 6T/12T và diện hạn chế xử lý (thai sản, ốm đau, nuôi con dưới 12 tháng)")
    public ResponseEntity<ApiResponse<DisciplineEligibilityResponse>> checkEligibility(@PathVariable UUID caseId) {
        DisciplineEligibilityResponse result = disciplineCaseService.checkEligibility(caseId);
        return ResponseEntity.ok(ApiResponse.ok(result, "Thẩm định điều kiện xử lý kỷ luật thành công"));
    }

    @PutMapping("/discipline-cases/{caseId}/participants")
    @PreAuthorize("@perm.has('discipline.manage')")
    @RequirePermission("discipline.manage")
    @Auditable(action = AuditAction.UPDATE, entityType = "DISCIPLINE_CASE", description = "Cập nhật thành phần tham dự họp kỷ luật")
    @Operation(summary = "Cập nhật thành phần tham dự họp kỷ luật", description = "Thay thế danh sách người tham gia họp xét kỷ luật")
    public ResponseEntity<ApiResponse<List<DisciplineParticipantResponse>>> updateParticipants(
            @PathVariable UUID caseId,
            @Valid @RequestBody UpdateParticipantsRequest request) {
        List<DisciplineParticipantResponse> result = disciplineCaseService.updateParticipants(caseId, request);
        return ResponseEntity.ok(ApiResponse.ok(result, "Cập nhật thành phần tham dự họp thành công"));
    }

    @GetMapping("/discipline-cases/{caseId}/evidences")
    @PreAuthorize("@perm.has('discipline.view')")
    @RequirePermission("discipline.view")
    @Operation(summary = "Lấy danh sách bằng chứng vi phạm")
    public ResponseEntity<ApiResponse<List<DisciplineEvidenceResponse>>> getEvidences(@PathVariable UUID caseId) {
        DisciplineCaseDetailResponse detail = disciplineCaseService.getDisciplineCaseById(caseId);
        return ResponseEntity.ok(ApiResponse.ok(detail.getEvidences(), "Lấy danh sách bằng chứng thành công"));
    }

    @PostMapping("/discipline-cases/{caseId}/evidences")
    @PreAuthorize("@perm.has('discipline.manage')")
    @RequirePermission("discipline.manage")
    @Auditable(action = AuditAction.CREATE, entityType = "DISCIPLINE_EVIDENCE", description = "Bổ sung bằng chứng vi phạm")
    @Operation(summary = "Thêm bằng chứng vi phạm vào hồ sơ")
    public ResponseEntity<ApiResponse<DisciplineEvidenceResponse>> addEvidence(
            @PathVariable UUID caseId,
            @Valid @RequestBody AddEvidenceRequest request) {
        DisciplineEvidenceResponse result = disciplineCaseService.addEvidence(caseId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(result, "Thêm bằng chứng thành công"));
    }

    @DeleteMapping("/discipline-evidences/{evidenceId}")
    @PreAuthorize("@perm.has('discipline.manage')")
    @RequirePermission("discipline.manage")
    @Auditable(action = AuditAction.DELETE, entityType = "DISCIPLINE_EVIDENCE", description = "Xóa bằng chứng vi phạm")
    @Operation(summary = "Xóa bằng chứng vi phạm")
    public ResponseEntity<ApiResponse<Void>> deleteEvidence(@PathVariable UUID evidenceId) {
        disciplineCaseService.deleteEvidence(evidenceId);
        return ResponseEntity.ok(ApiResponse.noContent("Xóa bằng chứng thành công"));
    }

    @PostMapping("/discipline-cases/{caseId}/decide")
    @PreAuthorize("@perm.has('discipline.decide')")
    @RequirePermission("discipline.decide")
    @Auditable(action = AuditAction.APPROVE, entityType = "DISCIPLINE_CASE", description = "Ban hành quyết định kỷ luật lao động")
    @Operation(summary = "Ban hành quyết định kỷ luật lao động", description = "Chuyển hồ sơ sang DECIDED. Không áp dụng cho hình thức SA_THAI")
    public ResponseEntity<ApiResponse<DisciplineCaseResponse>> decideDiscipline(
            @PathVariable UUID caseId,
            @Valid @RequestBody DecideDisciplineRequest request) {
        DisciplineCaseResponse result = disciplineCaseService.decideDiscipline(caseId, request);
        return ResponseEntity.ok(ApiResponse.ok(result, "Ban hành quyết định kỷ luật thành công"));
    }

    @PostMapping("/discipline-cases/{caseId}/submit-dismissal")
    @PreAuthorize("@perm.has('discipline.manage')")
    @RequirePermission("discipline.manage")
    @Auditable(action = AuditAction.UPDATE, entityType = "DISCIPLINE_CASE", description = "Trình duyệt sa thải lao động")
    @Operation(summary = "Trình phê duyệt sa thải lao động", description = "Chuyển trạng thái sang PENDING_DISMISSAL_APPROVAL qua Workflow sa thải")
    public ResponseEntity<ApiResponse<DisciplineCaseResponse>> submitDismissal(@PathVariable UUID caseId) {
        DisciplineCaseResponse result = disciplineCaseService.submitDismissal(caseId);
        return ResponseEntity.ok(ApiResponse.ok(result, "Trình phê duyệt sa thải thành công"));
    }
}
