package com.cyclosa.reward.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Bằng chứng vi phạm")
public class DisciplineEvidenceResponse {

    private UUID id;
    private String description;
    private UUID fileId;
    private String fileUrl;
    private String fileName;
    private Instant createdAt;
}
