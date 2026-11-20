package com.cyclosa.restructure.dto.response;

import com.cyclosa.restructure.enums.AssignmentStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScenarioEmployeeAssignmentResponse {

    private UUID id;
    private UUID scenarioId;
    private UUID employeeId;
    private String employeeCode;
    private String employeeName;
    private UUID originalDepartmentId;
    private String originalDepartmentName;
    private UUID newScenarioDeptId;
    private String newScenarioDeptName;
    private UUID originalJobTitleId;
    private String originalJobTitleName;
    private UUID newJobTitleId;
    private String newJobTitleName;
    private UUID originalManagerId;
    private String originalManagerName;
    private UUID newManagerId;
    private String newManagerName;
    private AssignmentStatus assignmentStatus;
    private BigDecimal proposedSalary;
    private String notes;
    private LocalDateTime createdAt;
}
