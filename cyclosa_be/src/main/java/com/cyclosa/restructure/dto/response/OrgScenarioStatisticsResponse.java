package com.cyclosa.restructure.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrgScenarioStatisticsResponse {

    private long totalScenarios;
    private long draftScenarios;
    private long submittedScenarios;
    private long approvedScenarios;
    private long executedScenarios;
}
