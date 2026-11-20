package com.cyclosa.restructure.dto.response;

import com.cyclosa.restructure.enums.RestructureActionType;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScenarioActionResponse {

    private UUID id;
    private UUID scenarioId;
    private RestructureActionType actionType;
    private String payload;
    private String summary;
    private UUID executedBy;
    private String executedByName;
    private LocalDateTime createdAt;
}
