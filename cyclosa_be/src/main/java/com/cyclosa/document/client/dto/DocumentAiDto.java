package com.cyclosa.document.client.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;
import java.util.Map;

public class DocumentAiDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class QualityCheckRequest {
        @JsonProperty("file_url")
        private String fileUrl;

        @JsonProperty("file_base64")
        private String fileBase64;

        @JsonProperty("file_name")
        private String fileName;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class QualityCheckResponse {
        private int dpi;

        @JsonProperty("is_dpi_valid")
        private boolean dpiValid;

        @JsonProperty("is_blurry")
        private boolean blurry;

        @JsonProperty("blur_score")
        private double blurScore;

        @JsonProperty("skew_angle")
        private double skewAngle;

        @JsonProperty("is_deskewed")
        private boolean deskewed;

        @JsonProperty("quality_status")
        private String qualityStatus;

        private String details;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class OcrExtractRequest {
        @JsonProperty("file_url")
        private String fileUrl;

        @JsonProperty("file_base64")
        private String fileBase64;

        @JsonProperty("raw_text")
        private String rawText;

        @JsonProperty("document_type")
        private String documentType;

        @JsonProperty("employee_id")
        private String employeeId;

        @JsonProperty("document_id")
        private String documentId;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class OcrExtractResponse {
        @JsonProperty("document_type")
        private String documentType;

        @JsonProperty("raw_text")
        private String rawText;

        @JsonProperty("extracted_fields")
        private Map<String, Object> extractedFields;

        @JsonProperty("field_confidences")
        private Map<String, Double> fieldConfidences;

        @JsonProperty("overall_confidence")
        private double overallConfidence;

        @JsonProperty("needs_manual_review")
        private boolean needsManualReview;

        @JsonProperty("review_reasons")
        private List<String> reviewReasons;

        private Map<String, Object> metadata;
    }
}
