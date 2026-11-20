package com.cyclosa.assistant.dto.response;

import com.cyclosa.assistant.enums.AiConversationStatus;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConversationSummaryResponse {
    private UUID id;
    private String title;
    private AiConversationStatus status;
    private long messageCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
