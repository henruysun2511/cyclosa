package com.cyclosa.career.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Chi tiết kịch bản mô phỏng lộ trình sự nghiệp")
public class CareerSimulationDetailResponse {

    private UUID id;
    private UUID employeeId;
    private String employeeName;
    private UUID startJobTitleId;
    private String startJobTitleName;
    private Integer tenureMonths;
    private String title;
    private LocalDateTime createdAt;
    private List<SimulationStepResponse> steps;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SimulationStepResponse {
        private UUID id;
        private Integer stepOrder;
        private UUID jobTitleId;
        private String jobTitleCode;
        private String jobTitleName;
        private BigDecimal matchPercent;
    }
}
