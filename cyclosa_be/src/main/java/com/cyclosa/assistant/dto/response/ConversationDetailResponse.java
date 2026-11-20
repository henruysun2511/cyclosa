package com.cyclosa.assistant.dto.response;

import com.cyclosa.assistant.enums.AiConversationStatus;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConversationDetailResponse {
    private UUID id;
    private String title;
    private AiConversationStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<MessageDetailResponse> messages;
}
