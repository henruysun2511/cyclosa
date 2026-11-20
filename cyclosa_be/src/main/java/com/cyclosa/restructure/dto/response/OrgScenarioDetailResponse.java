package com.cyclosa.restructure.dto.response;

import com.cyclosa.restructure.enums.ScenarioScope;
import com.cyclosa.restructure.enums.ScenarioStatus;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrgScenarioDetailResponse {

    private UUID id;
    private UUID companyId;
    private String name;
    private String code;
    private String description;
    private ScenarioScope scope;
    private ScenarioStatus status;
    private LocalDate targetEffectiveDate;
    private LocalDateTime executedAt;
    private UUID executedBy;
    private String executedByName;
    private UUID createdBy;
    private String createdByName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Long departmentCount;
    private Long employeeCount;
    private Long actionCount;

    private List<ScenarioDepartmentResponse> departments;
    private List<ScenarioActionResponse> recentActions;
}
