package com.cyclosa.recruitment.dto;

import com.cyclosa.recruitment.enums.OverallRecommendation;
import com.cyclosa.recruitment.enums.ScorecardStatus;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class ScorecardDto {

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ScoreItemRequest {
        @NotNull(message = "Tiêu chí đánh giá không được để trống")
        private UUID criterionId;

        @NotNull(message = "Điểm số không được để trống")
        private BigDecimal score;

        private String comments;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SubmitScorecardRequest {
        @NotNull(message = "Buổi phỏng vấn không được để trống")
        private UUID interviewId;

        @NotNull(message = "Kết luận đánh giá không được để trống")
        private OverallRecommendation overallRecommendation;

        private String strengths;
        private String weaknesses;
        private String generalNotes;

        @NotEmpty(message = "Danh sách điểm tiêu chí không được để trống")
        private List<ScoreItemRequest> scores;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ScoreItemResponse {
        private UUID id;
        private UUID criterionId;
        private String criterionName;
        private BigDecimal score;
        private BigDecimal maxScore;
        private BigDecimal weight;
        private String comments;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ContentFlagResponse {
        private UUID id;
        private String flagType;
        private String flaggedContent;
        private String suggestion;
        private String severity;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private UUID id;
        private UUID interviewId;
        private UUID interviewerId;
        private String interviewerName;
        private BigDecimal overallScore;
        private OverallRecommendation overallRecommendation;
        private String strengths;
        private String weaknesses;
        private String generalNotes;
        private ScorecardStatus status;
        private LocalDateTime submittedAt;
        private List<ScoreItemResponse> scores;
        private List<ContentFlagResponse> contentFlags;
    }
}
