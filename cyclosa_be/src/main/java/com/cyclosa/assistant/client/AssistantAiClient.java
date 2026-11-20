package com.cyclosa.assistant.client;

import com.cyclosa.assistant.client.dto.AssistantAiDto;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.time.Duration;
import java.util.Optional;

@Slf4j
@Component
public class AssistantAiClient {

    private final RestClient restClient;

    public AssistantAiClient(
            @Value("${cyclosa.ai.base-url:http://localhost:8000}") String baseUrl,
            @Value("${cyclosa.ai.api-key:cyclosa-internal-ai-secret-key-2026}") String apiKey
    ) {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(Duration.ofSeconds(10));
        factory.setReadTimeout(Duration.ofSeconds(45));

        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .requestFactory(factory)
                .defaultHeader("X-Internal-API-Key", apiKey)
                .build();
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AiResponse<T> {
        private boolean success;
        private int code;
        private String message;
        private T data;
    }

    public Optional<AssistantAiDto.ChatResponseData> chat(AssistantAiDto.ChatRequest request) {
        try {
            log.info("Gọi Cyclosa AI Assistant Chat cho query: {}", request.getQuery());
            AiResponse<AssistantAiDto.ChatResponseData> response = restClient.post()
                    .uri("/api/v1/assistant/chat")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(new ParameterizedTypeReference<AiResponse<AssistantAiDto.ChatResponseData>>() {});

            if (response != null && response.getData() != null) {
                return Optional.of(response.getData());
            }
        } catch (Exception e) {
            log.warn("Không thể kết nối đến Cyclosa AI Assistant Service: {}", e.getMessage());
        }
        return Optional.empty();
    }
}
