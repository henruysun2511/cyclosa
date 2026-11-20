package com.cyclosa.restructure.dto.response;

import com.cyclosa.restructure.enums.ConflictSeverity;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestructureConflictResponse {

    private UUID scenarioId;
    private boolean hasCriticalErrors;
    private long criticalCount;
    private long warningCount;
    private long infoCount;

    private List<ConflictItem> conflicts;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ConflictItem {
        private String code;
        private ConflictSeverity severity;
        private String title;
        private String description;
        private String targetEntity;
        private UUID targetId;
        private String suggestion;
    }
}
