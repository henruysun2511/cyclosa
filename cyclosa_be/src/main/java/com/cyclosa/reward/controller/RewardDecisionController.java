package com.cyclosa.reward.controller;

import com.cyclosa.audit.aop.Auditable;
import com.cyclosa.audit.enums.AuditAction;
import com.cyclosa.common.annotation.RequirePermission;
import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.common.response.PageData;
import com.cyclosa.reward.dto.request.CreateRewardDecisionRequest;
import com.cyclosa.reward.dto.request.RewardDecisionFilter;
import com.cyclosa.reward.dto.request.UpdateRewardDecisionRequest;
import com.cyclosa.reward.dto.response.RewardDecisionResponse;
import com.cyclosa.reward.service.RewardDecisionService;
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
@RequestMapping("/api/v1/reward-decisions")
@RequiredArgsConstructor
@Tag(name = "Reward Decisions", description = "Quản lý quyết định khen thưởng nhân viên")
public class RewardDecisionController {

    private final RewardDecisionService rewardDecisionService;

    @GetMapping
    @PreAuthorize("@perm.has('reward.view')")
    @RequirePermission("reward.view")
    @Operation(summary = "Lấy danh sách quyết định khen thưởng", description = "Lọc theo nhân viên, hình thức thưởng, khoảng ngày có phân trang")
    public ResponseEntity<ApiResponse<PageData<RewardDecisionResponse>>> getRewardDecisions(@Valid RewardDecisionFilter filter) {
        PageData<RewardDecisionResponse> result = rewardDecisionService.getRewardDecisions(filter);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách quyết định khen thưởng thành công"));
    }

    @GetMapping("/{decisionId}")
    @PreAuthorize("@perm.has('reward.view')")
    @RequirePermission("reward.view")
    @Operation(summary = "Xem chi tiết quyết định khen thưởng", description = "Trả về thông tin quyết định kèm cờ đã chuyển vào kỳ lương hay chưa")
    public ResponseEntity<ApiResponse<RewardDecisionResponse>> getRewardDecisionById(@PathVariable UUID decisionId) {
        RewardDecisionResponse result = rewardDecisionService.getRewardDecisionById(decisionId);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy chi tiết quyết định khen thưởng thành công"));
    }

    @PostMapping
    @PreAuthorize("@perm.has('reward.manage')")
    @RequirePermission("reward.manage")
    @Auditable(action = AuditAction.CREATE, entityType = "REWARD_DECISION", description = "Lập quyết định khen thưởng mới")
    @Operation(summary = "Lập quyết định khen thưởng mới", description = "Hình thức thưởng tiền bắt buộc nhập số tiền lớn hơn 0")
    public ResponseEntity<ApiResponse<RewardDecisionResponse>> createRewardDecision(@Valid @RequestBody CreateRewardDecisionRequest request) {
        RewardDecisionResponse result = rewardDecisionService.createRewardDecision(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(result, "Lập quyết định khen thưởng thành công"));
    }

    @PutMapping("/{decisionId}")
    @PreAuthorize("@perm.has('reward.manage')")
    @RequirePermission("reward.manage")
    @Auditable(action = AuditAction.UPDATE, entityType = "REWARD_DECISION", description = "Cập nhật quyết định khen thưởng")
    @Operation(summary = "Cập nhật quyết định khen thưởng", description = "Bị khóa không cho chỉnh sửa khi quyết định đã được chuyển vào kỳ lương")
    public ResponseEntity<ApiResponse<RewardDecisionResponse>> updateRewardDecision(
            @PathVariable UUID decisionId,
            @Valid @RequestBody UpdateRewardDecisionRequest request) {
        RewardDecisionResponse result = rewardDecisionService.updateRewardDecision(decisionId, request);
        return ResponseEntity.ok(ApiResponse.ok(result, "Cập nhật quyết định khen thưởng thành công"));
    }

    @DeleteMapping("/{decisionId}")
    @PreAuthorize("@perm.has('reward.manage')")
    @RequirePermission("reward.manage")
    @Auditable(action = AuditAction.DELETE, entityType = "REWARD_DECISION", description = "Xóa quyết định khen thưởng")
    @Operation(summary = "Xóa quyết định khen thưởng", description = "Chỉ cho phép xóa khi chưa chuyển vào bảng lương")
    public ResponseEntity<ApiResponse<Void>> deleteRewardDecision(@PathVariable UUID decisionId) {
        rewardDecisionService.deleteRewardDecision(decisionId);
        return ResponseEntity.ok(ApiResponse.noContent("Xóa quyết định khen thưởng thành công"));
    }
}
