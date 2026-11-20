package com.cyclosa.reward.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Chi tiết hồ sơ kỷ luật kèm biên bản, hội đồng và bằng chứng")
public class DisciplineCaseDetailResponse {

    private DisciplineCaseResponse caseInfo;
    private String ruleBasis;
    private java.time.LocalDate meetingDate;
    private String meetingNote;
    private String reason;

    private List<DisciplineParticipantResponse> participants;
    private List<DisciplineEvidenceResponse> evidences;
}

