package com.cyclosa.attendance.client;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Component
public class AttendanceAiClient {

    private final RestClient restClient;

    public AttendanceAiClient(
            @Value("${cyclosa.ai.base-url:http://localhost:8000}") String baseUrl,
            @Value("${cyclosa.ai.api-key:cyclosa-internal-ai-secret-key-2026}") String apiKey
    ) {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(Duration.ofSeconds(5));
        factory.setReadTimeout(Duration.ofSeconds(15));

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

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class FaceEnrollAiRequest {
        private String employee_id;
        private String image_base64;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class FaceEnrollAiResult {
        private String employee_id;
        private List<Double> embedding;
        private Integer dimension;
        private Double quality_score;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class FaceVerifyAiRequest {
        private String employee_id;
        private String live_image_base64;
        private String enrolled_template_ref;
        private String enrolled_image_base64;
        private Boolean liveness_check;
        private Double threshold;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class FaceVerifyAiResult {
        private Boolean is_matched;
        private Double match_score;
        private Boolean is_live;
        private String verification_result;
        private String details;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AnomalyDetectAiRequest {
        private String employee_id;
        private Double latitude;
        private Double longitude;
        private String occurred_at;
        private List<Map<String, Object>> history_points;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AnomalyDetectAiResult {
        private Boolean is_suspicious;
        private Double confidence_score;
        private List<String> risk_factors;
    }

    public Optional<FaceEnrollAiResult> enrollFace(FaceEnrollAiRequest request) {
        try {
            log.info("Gọi Cyclosa AI đăng ký khuôn mặt nhân viên: {}", request.getEmployee_id());
            AiResponse<FaceEnrollAiResult> res = restClient.post()
                    .uri("/api/v1/attendance/face/enroll")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(new ParameterizedTypeReference<AiResponse<FaceEnrollAiResult>>() {});

            if (res != null && res.getData() != null) {
                return Optional.of(res.getData());
            }
        } catch (Exception e) {
            log.warn("Không thể kết nối hoặc lỗi khi gọi AI Face Enroll: {}", e.getMessage());
        }
        return Optional.empty();
    }

    public Optional<FaceVerifyAiResult> verifyFace(FaceVerifyAiRequest request) {
        try {
            log.info("Gọi Cyclosa AI xác thực khuôn mặt nhân viên: {}", request.getEmployee_id());
            AiResponse<FaceVerifyAiResult> res = restClient.post()
                    .uri("/api/v1/attendance/face/verify")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(new ParameterizedTypeReference<AiResponse<FaceVerifyAiResult>>() {});

            if (res != null && res.getData() != null) {
                return Optional.of(res.getData());
            }
        } catch (Exception e) {
            log.warn("Không thể kết nối hoặc lỗi khi gọi AI Face Verify: {}. Sử dụng heuristic fallback.", e.getMessage());
        }
        return Optional.empty();
    }

    public Optional<AnomalyDetectAiResult> detectAnomaly(AnomalyDetectAiRequest request) {
        try {
            log.info("Gọi Cyclosa AI phát hiện bất thường GPS cho nhân viên: {}", request.getEmployee_id());
            AiResponse<AnomalyDetectAiResult> res = restClient.post()
                    .uri("/api/v1/attendance/anomaly/detect")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(new ParameterizedTypeReference<AiResponse<AnomalyDetectAiResult>>() {});

            if (res != null && res.getData() != null) {
                return Optional.of(res.getData());
            }
        } catch (Exception e) {
            log.warn("Không thể kết nối hoặc lỗi khi gọi AI Anomaly Detect: {}", e.getMessage());
        }
        return Optional.empty();
    }
}

