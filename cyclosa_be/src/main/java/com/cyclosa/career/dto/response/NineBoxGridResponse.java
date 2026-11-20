package com.cyclosa.career.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Phân bổ ma trận 9-Box Grid")
public class NineBoxGridResponse {

    @Schema(description = "Danh sách 9 ô ma trận")
    private List<NineBoxCell> cells;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class NineBoxCell {
        private String boxCode;
        private String title;
        private String performanceLevel; // HIGH, MEDIUM, LOW
        private String potentialLevel;   // HIGH, MEDIUM, LOW
        private Integer candidateCount;
        private List<TalentPoolEntryResponse> candidates;
    }
}
