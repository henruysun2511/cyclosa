package com.cyclosa.assistant.dto.response;

import com.cyclosa.assistant.enums.AiMessageFeedback;
import com.cyclosa.assistant.enums.AiMessageRole;
import com.cyclosa.assistant.enums.AiResponseType;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageDetailResponse {
    private UUID id;
    private AiMessageRole role;
    private String content;
    private AiResponseType responseType;
    private String functionCalls;
    private String sourceDocuments;
    private String chartConfig;
    private Integer tokenUsage;
    private AiMessageFeedback feedback;
    private String feedbackNote;
    private LocalDateTime createdAt;
}
