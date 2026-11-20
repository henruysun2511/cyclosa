package com.cyclosa.recruitment.controller;

import com.cyclosa.common.annotation.RequirePermission;
import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.common.response.PageData;
import com.cyclosa.recruitment.client.dto.AiClientDto;
import com.cyclosa.recruitment.dto.InterviewDto;
import com.cyclosa.recruitment.service.InterviewService;
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
@RequestMapping("/api/v1/recruitment/interviews")
@RequiredArgsConstructor
@Tag(name = "Interview", description = "Quản lý lịch phỏng vấn & sinh câu hỏi AI")
public class InterviewController {

    private final InterviewService interviewService;

    @PostMapping("/schedule")
    @PreAuthorize("@perm.has('recruitment.interview.schedule')")
    @RequirePermission("recruitment.interview.schedule")
    @Operation(summary = "Lên lịch phỏng vấn mới và gửi thông báo cho hội đồng")
    public ResponseEntity<ApiResponse<InterviewDto.Response>> scheduleInterview(
            @Valid @RequestBody InterviewDto.ScheduleRequest request
    ) {
        InterviewDto.Response response = interviewService.scheduleInterview(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(response, "Lên lịch phỏng vấn thành công"));
    }

    @PutMapping("/{id}/reschedule")
    @PreAuthorize("@perm.has('recruitment.interview.schedule')")
    @RequirePermission("recruitment.interview.schedule")
    @Operation(summary = "Dời lịch phỏng vấn sang thời gian khác")
    public ResponseEntity<ApiResponse<InterviewDto.Response>> rescheduleInterview(
            @PathVariable UUID id,
            @Valid @RequestBody InterviewDto.RescheduleRequest request
    ) {
        InterviewDto.Response response = interviewService.rescheduleInterview(id, request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Dời lịch phỏng vấn thành công"));
    }

    @PostMapping("/{id}/cancel")
    @PreAuthorize("@perm.has('recruitment.interview.schedule')")
    @RequirePermission("recruitment.interview.schedule")
    @Operation(summary = "Hủy buổi phỏng vấn")
    public ResponseEntity<ApiResponse<InterviewDto.Response>> cancelInterview(
            @PathVariable UUID id,
            @Valid @RequestBody InterviewDto.CancelRequest request
    ) {
        InterviewDto.Response response = interviewService.cancelInterview(id, request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Hủy lịch phỏng vấn thành công"));
    }

    @PostMapping("/{id}/complete")
    @PreAuthorize("@perm.has('recruitment.interview.schedule')")
    @RequirePermission("recruitment.interview.schedule")
    @Operation(summary = "Đánh dấu buổi phỏng vấn đã hoàn tất")
    public ResponseEntity<ApiResponse<InterviewDto.Response>> completeInterview(
            @PathVariable UUID id
    ) {
        InterviewDto.Response response = interviewService.completeInterview(id);
        return ResponseEntity.ok(ApiResponse.ok(response, "Đã đánh dấu hoàn tất buổi phỏng vấn"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("@perm.has('recruitment.interview.view')")
    @RequirePermission("recruitment.interview.view")
    @Operation(summary = "Xem chi tiết buổi phỏng vấn và hội đồng phỏng vấn")
    public ResponseEntity<ApiResponse<InterviewDto.Response>> getInterviewById(
            @PathVariable UUID id
    ) {
        InterviewDto.Response response = interviewService.getInterviewById(id);
        return ResponseEntity.ok(ApiResponse.ok(response, "Lấy chi tiết phỏng vấn thành công"));
    }

    @GetMapping
    @PreAuthorize("@perm.has('recruitment.interview.view')")
    @RequirePermission("recruitment.interview.view")
    @Operation(summary = "Tìm kiếm và phân trang danh sách các buổi phỏng vấn")
    public ResponseEntity<ApiResponse<PageData<InterviewDto.Response>>> searchInterviews(
            @ModelAttribute InterviewDto.FilterRequest filter
    ) {
        PageData<InterviewDto.Response> response = interviewService.searchInterviews(filter);
        return ResponseEntity.ok(ApiResponse.ok(response, "Lấy danh sách phỏng vấn thành công"));
    }

    @PostMapping("/rounds/{roundId}/generate-questions")
    @PreAuthorize("@perm.has('recruitment.interview.schedule')")
    @RequirePermission("recruitment.interview.schedule")
    @Operation(summary = "Dùng AI sinh bộ câu hỏi phỏng vấn chuẩn phương pháp STAR")
    public ResponseEntity<ApiResponse<List<AiClientDto.QuestionResponse>>> generateInterviewQuestions(
            @PathVariable UUID roundId,
            @RequestParam String targetRole,
            @RequestParam(defaultValue = "Mid-Level") String seniorityLevel,
            @RequestParam(required = false) List<String> focusAreas,
            @RequestParam(defaultValue = "5") int count
    ) {
        List<AiClientDto.QuestionResponse> questions = interviewService.generateQuestionsForRound(
                roundId, targetRole, seniorityLevel, focusAreas, count
        );
        return ResponseEntity.ok(ApiResponse.ok(questions, "Sinh câu hỏi phỏng vấn STAR bằng AI thành công"));
    }
}
