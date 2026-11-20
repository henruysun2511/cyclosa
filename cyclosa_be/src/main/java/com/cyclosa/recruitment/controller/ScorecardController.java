package com.cyclosa.recruitment.controller;

import com.cyclosa.common.annotation.RequirePermission;
import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.recruitment.dto.ScorecardDto;
import com.cyclosa.recruitment.service.ScorecardService;
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
@RequestMapping("/api/v1/recruitment/scorecards")
@RequiredArgsConstructor
@Tag(name = "Scorecard", description = "Quản lý phiếu đánh giá phỏng vấn & cơ chế chấm mù (Blind Grading)")
public class ScorecardController {

    private final ScorecardService scorecardService;

    @PostMapping
    @PreAuthorize("@perm.has('recruitment.interview.score')")
    @RequirePermission("recruitment.interview.score")
    @Operation(summary = "Nộp phiếu đánh giá ứng viên (kích hoạt quét AI phát hiện thiên vị)")
    public ResponseEntity<ApiResponse<ScorecardDto.Response>> submitScorecard(
            @RequestHeader(value = "X-User-Id", required = false) UUID userId,
            @Valid @RequestBody ScorecardDto.SubmitScorecardRequest request
    ) {
        UUID interviewerId = userId != null ? userId : UUID.randomUUID();
        ScorecardDto.Response response = scorecardService.submitScorecard(interviewerId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(response, "Nộp phiếu đánh giá ứng viên thành công"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("@perm.has('recruitment.interview.score')")
    @RequirePermission("recruitment.interview.score")
    @Operation(summary = "Xem chi tiết một phiếu đánh giá phỏng vấn")
    public ResponseEntity<ApiResponse<ScorecardDto.Response>> getScorecardById(
            @PathVariable UUID id
    ) {
        ScorecardDto.Response response = scorecardService.getScorecardById(id);
        return ResponseEntity.ok(ApiResponse.ok(response, "Lấy thông tin phiếu đánh giá thành công"));
    }

    @GetMapping("/interview/{interviewId}")
    @PreAuthorize("@perm.has('recruitment.interview.view')")
    @RequirePermission("recruitment.interview.view")
    @Operation(summary = "Lấy tất cả phiếu đánh giá của buổi phỏng vấn (áp dụng kiểm tra Chấm Mù)")
    public ResponseEntity<ApiResponse<List<ScorecardDto.Response>>> getScorecardsByInterview(
            @PathVariable UUID interviewId,
            @RequestHeader(value = "X-User-Id", required = false) UUID userId,
            @RequestParam(defaultValue = "false") boolean isHrAdmin
    ) {
        UUID currentUserId = userId != null ? userId : UUID.randomUUID();
        List<ScorecardDto.Response> response = scorecardService.getScorecardsByInterview(
                interviewId, currentUserId, isHrAdmin
        );
        return ResponseEntity.ok(ApiResponse.ok(response, "Lấy danh sách phiếu đánh giá thành công"));
    }
}
