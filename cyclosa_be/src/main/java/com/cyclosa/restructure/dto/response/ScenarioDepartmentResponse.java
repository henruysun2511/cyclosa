package com.cyclosa.restructure.dto.response;

import com.cyclosa.restructure.enums.DepartmentScenarioStatus;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScenarioDepartmentResponse {

    private UUID id;
    private UUID scenarioId;
    private UUID originalDepartmentId;
    private UUID parentScenarioDeptId;
    private String parentDepartmentName;
    private String code;
    private String name;
    private UUID managerEmployeeId;
    private String managerEmployeeName;
    private DepartmentScenarioStatus statusInScenario;
    private Integer targetHeadcount;
    private Long currentHeadcount;
    private Boolean isPermissionInherited;
    private String notes;
    private LocalDateTime createdAt;
}
