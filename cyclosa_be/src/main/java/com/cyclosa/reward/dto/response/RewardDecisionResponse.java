package com.cyclosa.reward.dto.response;

import com.cyclosa.reward.enums.RewardType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Thông tin quyết định khen thưởng")
public class RewardDecisionResponse {

    private UUID id;
    private UUID companyId;
    private UUID employeeId;
    private String employeeName;
    private String employeeCode;
    private String departmentName;

    private RewardType rewardType;
    private String title;
    private String reason;
    private BigDecimal amount;

    private UUID decidedByEmployeeId;
    private String decidedByEmployeeName;
    private LocalDate decisionDate;

    @Schema(description = "Cờ trạng thái đã chuyển vào kỳ lương hay chưa")
    private Boolean pushedToPayroll;

    private LocalDateTime createdAt;
}
