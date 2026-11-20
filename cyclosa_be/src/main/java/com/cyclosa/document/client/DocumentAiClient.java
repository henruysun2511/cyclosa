package com.cyclosa.document.client;

import com.cyclosa.document.client.dto.DocumentAiDto;
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
public class DocumentAiClient {

    private final RestClient restClient;

    public DocumentAiClient(
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

    /**
     * Thẩm định kỹ thuật tệp số hóa (DPI, độ mờ, góc nghiêng) theo Thông tư 05/2025/TT-BNV
     */
    public Optional<DocumentAiDto.QualityCheckResponse> checkQuality(DocumentAiDto.QualityCheckRequest request) {
        try {
            log.info("Gọi Cyclosa AI thẩm định chất lượng số hóa tệp: {}", request.getFileName());
            AiResponse<DocumentAiDto.QualityCheckResponse> response = restClient.post()
                    .uri("/api/v1/ocr/quality-check")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(new ParameterizedTypeReference<AiResponse<DocumentAiDto.QualityCheckResponse>>() {});

            if (response != null && response.getData() != null) {
                return Optional.of(response.getData());
            }
        } catch (Exception e) {
            log.warn("Không thể kết nối đến Cyclosa AI OCR Quality Check (đang dùng fallback nội bộ): {}", e.getMessage());
        }
        return Optional.empty();
    }

    /**
     * Bóc tách dữ liệu có cấu trúc từ hồ sơ nhân sự (CCCD, Bằng cấp, Hợp đồng)
     */
    public Optional<DocumentAiDto.OcrExtractResponse> extractDocument(DocumentAiDto.OcrExtractRequest request) {
        try {
            log.info("Gọi Cyclosa AI OCR bóc tách tài liệu loại: {} (ID: {})", request.getDocumentType(), request.getDocumentId());
            AiResponse<DocumentAiDto.OcrExtractResponse> response = restClient.post()
                    .uri("/api/v1/ocr/extract")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(new ParameterizedTypeReference<AiResponse<DocumentAiDto.OcrExtractResponse>>() {});

            if (response != null && response.getData() != null) {
                return Optional.of(response.getData());
            }
        } catch (Exception e) {
            log.warn("Không thể kết nối đến Cyclosa AI OCR Extraction (đang dùng fallback): {}", e.getMessage());
        }
        return Optional.empty();
    }
}
