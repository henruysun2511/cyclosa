package com.cyclosa.reward.controller;

import com.cyclosa.common.dto.request.BaseFilterRequest;
import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.common.response.PageData;
import com.cyclosa.reward.dto.request.CreateComplaintRequest;
import com.cyclosa.reward.dto.response.ComplaintResponse;
import com.cyclosa.reward.dto.response.DisciplineCaseResponse;
import com.cyclosa.reward.dto.response.RewardDecisionResponse;
import com.cyclosa.reward.service.ComplaintService;
import com.cyclosa.reward.service.DisciplineCaseService;
import com.cyclosa.reward.service.RewardDecisionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Self-Service Reward & Discipline", description = "Cổng tự phục vụ cá nhân về khen thưởng, kỷ luật và khiếu nại (ESS)")
public class MeRewardDisciplineController {

    private final RewardDecisionService rewardDecisionService;
    private final DisciplineCaseService disciplineCaseService;
    private final ComplaintService complaintService;

    @GetMapping("/api/v1/me/reward-decisions")
    @Operation(summary = "Xem lịch sử khen thưởng của tôi")
    public ResponseEntity<ApiResponse<List<RewardDecisionResponse>>> getMyRewardDecisions() {
        List<RewardDecisionResponse> result = rewardDecisionService.getMyRewardDecisions();
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách khen thưởng của tôi thành công"));
    }

    @GetMapping("/api/v1/me/discipline-cases")
    @Operation(summary = "Xem các quyết định kỷ luật liên quan đến tôi")
    public ResponseEntity<ApiResponse<List<DisciplineCaseResponse>>> getMyDisciplineCases() {
        List<DisciplineCaseResponse> result = disciplineCaseService.getMyDisciplineCases();
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách kỷ luật liên quan thành công"));
    }

    @PostMapping("/api/v1/complaints")
    @Operation(summary = "Nhân viên gửi khiếu nại hoặc phản ánh mới", description = "Khởi tạo khiếu nại ở trạng thái OPEN")
    public ResponseEntity<ApiResponse<ComplaintResponse>> createComplaint(@Valid @RequestBody CreateComplaintRequest request) {
        ComplaintResponse result = complaintService.createComplaint(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(result, "Gửi đơn khiếu nại thành công"));
    }

    @GetMapping("/api/v1/me/complaints")
    @Operation(summary = "Xem danh sách khiếu nại của tôi có phân trang")
    public ResponseEntity<ApiResponse<PageData<ComplaintResponse>>> getMyComplaints(@Valid BaseFilterRequest filter) {
        PageData<ComplaintResponse> result = complaintService.getMyComplaints(filter);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách khiếu nại của tôi thành công"));
    }
}
