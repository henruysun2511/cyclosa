package com.cyclosa.assistant.dto.response;

import com.cyclosa.assistant.client.dto.AssistantAiDto;
import lombok.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatClientResponse {
    private UUID conversationId;
    private UUID messageId;
    private String response;
    private String intent;
    private String functionCalled;
    private Map<String, Object> functionArgs;
    private List<AssistantAiDto.Citation> citations;
    private String chartConfig;
    private String disclaimer;
    private Integer executionTimeMs;
}
