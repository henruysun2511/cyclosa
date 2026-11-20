package com.cyclosa.assistant.dto.response;

import com.cyclosa.assistant.enums.UnansweredQuestionStatus;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UnansweredQuestionResponse {
    private UUID id;
    private String questionText;
    private UUID clusterId;
    private UnansweredQuestionStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
}
