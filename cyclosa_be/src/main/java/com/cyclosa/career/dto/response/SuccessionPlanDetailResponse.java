package com.cyclosa.career.dto.response;

import com.cyclosa.career.enums.RiskLevel;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Thông tin chi tiết kế hoạch kế nhiệm")
public class SuccessionPlanDetailResponse {

    private UUID id;
    private UUID companyId;
    private UUID departmentId;
    private String departmentName;
    private UUID jobTitleId;
    private String jobTitleName;
    private RiskLevel riskLevel;
    private LocalDate reviewDate;

    // Người đang đương nhiệm
    private UUID currentHolderId;
    private String currentHolderCode;
    private String currentHolderName;
    private String currentHolderPortraitUrl;

    // Danh sách ứng viên
    @Builder.Default
    private List<SuccessionCandidateResponse> candidates = new ArrayList<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
