package com.cyclosa.career.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Kịch bản mô phỏng lộ trình sự nghiệp")
public class CareerSimulationResponse {

    private UUID id;
    private UUID employeeId;
    private String employeeName;
    private UUID startJobTitleId;
    private String startJobTitleName;
    private Integer tenureMonths;
    private String title;
    private Integer totalSteps;
    private LocalDateTime createdAt;
}
