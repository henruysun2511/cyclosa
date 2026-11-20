package com.cyclosa.employee.dto.response;

import com.cyclosa.employee.entity.enums.ProbationResult;
import com.cyclosa.workflow.enums.WorkflowOverallStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProbationEvaluationResponse {

    private UUID id;
    private UUID employeeId;
    private ProbationResult result;
    private WorkflowOverallStatus status;
    private LocalDate evaluationDate;
    private UUID evaluatedByEmployeeId;
    private String evaluatedByEmployeeName;
    private String comment;
    private LocalDateTime createdAt;
}

