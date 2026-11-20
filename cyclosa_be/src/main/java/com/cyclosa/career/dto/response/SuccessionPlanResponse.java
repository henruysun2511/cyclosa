package com.cyclosa.career.dto.response;

import com.cyclosa.career.enums.RiskLevel;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Thông tin tóm tắt kế hoạch kế nhiệm")
public class SuccessionPlanResponse {

    private UUID id;
    private UUID companyId;
    private UUID departmentId;
    private String departmentName;
    private UUID jobTitleId;
    private String jobTitleName;
    private RiskLevel riskLevel;
    private LocalDate reviewDate;

    // Người đang đương nhiệm (derived)
    private UUID currentHolderId;
    private String currentHolderCode;
    private String currentHolderName;

    // Số lượng ứng viên
    private int candidateCount;
    private int readyNowCount;

    private LocalDateTime createdAt;
}
