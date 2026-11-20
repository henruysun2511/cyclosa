package com.cyclosa.recruitment.client;

import com.cyclosa.recruitment.client.dto.AiClientDto;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

import java.time.Duration;
import java.util.List;
import java.util.Optional;

@Slf4j
@Component
public class RecruitmentAiClient {

    private final RestClient restClient;
    private final String apiKey;

    public RecruitmentAiClient(
            @Value("${cyclosa.ai.base-url:http://localhost:8000}") String baseUrl,
            @Value("${cyclosa.ai.api-key:cyclosa-internal-ai-secret-key-2026}") String apiKey
    ) {
        this.apiKey = apiKey;

        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(Duration.ofSeconds(10));
        factory.setReadTimeout(Duration.ofSeconds(60));

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
     * Sàng lọc CV và chấm điểm độ phù hợp qua AI
     */
    public Optional<AiClientDto.CvScreenResponse> screenCv(AiClientDto.CvScreenRequest request) {
        try {
            log.info("Gọi AI microservice sàng lọc CV cho vị trí: {}", request.getJobTitle());
            AiResponse<AiClientDto.CvScreenResponse> response = restClient.post()
                    .uri("/api/v1/recruitment/cv/screen")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(new ParameterizedTypeReference<AiResponse<AiClientDto.CvScreenResponse>>() {});

            if (response != null && response.getData() != null) {
                return Optional.of(response.getData());
            }
        } catch (Exception e) {
            log.error("Lỗi khi gọi AI sàng lọc CV: {}", e.getMessage(), e);
        }
        return Optional.empty();
    }

    /**
     * Bóc tách thông tin ứng viên từ file CV (PDF / DOCX)
     */
    public Optional<AiClientDto.CandidateParsedProfile> parseCv(MultipartFile file) {
        try {
            log.info("Gọi AI microservice bóc tách CV: {}", file.getOriginalFilename());

            ByteArrayResource fileResource = new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename();
                }
            };

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", fileResource);

            AiResponse<AiClientDto.CandidateParsedProfile> response = restClient.post()
                    .uri("/api/v1/recruitment/cv/parse-file")
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(body)
                    .retrieve()
                    .body(new ParameterizedTypeReference<AiResponse<AiClientDto.CandidateParsedProfile>>() {});

            if (response != null && response.getData() != null) {
                return Optional.of(response.getData());
            }
        } catch (Exception e) {
            log.error("Lỗi khi gọi AI bóc tách CV: {}", e.getMessage(), e);
        }
        return Optional.empty();
    }

    /**
     * Sinh bộ câu hỏi phỏng vấn theo phương pháp STAR
     */
    public List<AiClientDto.QuestionResponse> generateQuestions(AiClientDto.QuestionRequest request) {
        try {
            log.info("Gọi AI microservice sinh câu hỏi phỏng vấn cho: {}", request.getJobTitle());
            AiResponse<AiClientDto.QuestionResultWrapper> response = restClient.post()
                    .uri("/api/v1/recruitment/interviews/generate-questions")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(new ParameterizedTypeReference<AiResponse<AiClientDto.QuestionResultWrapper>>() {});

            if (response != null && response.getData() != null && response.getData().getQuestions() != null) {
                return response.getData().getQuestions();
            }
        } catch (Exception e) {
            log.error("Lỗi khi gọi AI sinh câu hỏi phỏng vấn: {}", e.getMessage(), e);
        }
        return List.of();
    }

    /**
     * Quét nội dung phiếu đánh giá phỏng vấn phát hiện thiên vị hoặc vi phạm
     */
    public Optional<AiClientDto.ContentScanResponse> scanScorecard(AiClientDto.ScorecardScanRequest request) {
        try {
            log.info("Gọi AI microservice kiểm tra phiếu đánh giá");
            AiResponse<AiClientDto.ContentScanResponse> response = restClient.post()
                    .uri("/api/v1/recruitment/compliance/scan-content")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(new ParameterizedTypeReference<AiResponse<AiClientDto.ContentScanResponse>>() {});

            if (response != null && response.getData() != null) {
                return Optional.of(response.getData());
            }
        } catch (Exception e) {
            log.error("Lỗi khi gọi AI quét nội dung phiếu phỏng vấn: {}", e.getMessage(), e);
        }
        return Optional.empty();
    }
}
