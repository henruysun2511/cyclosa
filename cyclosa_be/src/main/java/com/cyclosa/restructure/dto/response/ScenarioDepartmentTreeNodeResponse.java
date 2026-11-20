package com.cyclosa.restructure.dto.response;

import com.cyclosa.restructure.enums.DepartmentScenarioStatus;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScenarioDepartmentTreeNodeResponse {

    private UUID id;
    private UUID scenarioId;
    private UUID originalDepartmentId;
    private UUID parentScenarioDeptId;
    private String code;
    private String name;
    private UUID managerEmployeeId;
    private String managerEmployeeName;
    private DepartmentScenarioStatus statusInScenario;
    private Integer targetHeadcount;
    private Long currentHeadcount;
    private Boolean isPermissionInherited;
    private String notes;

    @Builder.Default
    private List<ScenarioDepartmentTreeNodeResponse> children = new ArrayList<>();
}
