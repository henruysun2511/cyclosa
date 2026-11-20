package com.cyclosa.recruitment.dto;

import com.cyclosa.recruitment.enums.ApplicationStage;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class ApplicationDto {

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {
        @NotNull(message = "Pháp nhân công ty không được để trống")
        private UUID companyId;

        @NotNull(message = "Vị trí tuyển dụng không được để trống")
        private UUID jobOpeningId;

        @NotNull(message = "Ứng viên không được để trống")
        private UUID candidateId;

        private UUID channelId;
        private UUID referrerId;
        private String coverLetter;
        private String customCvUrl;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateStageRequest {
        @NotNull(message = "Giai đoạn ứng tuyển mới không được để trống")
        private ApplicationStage toStage;

        private String reason;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RejectRequest {
        private String reason;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private UUID id;
        private UUID companyId;
        private String applicationCode;
        private UUID jobOpeningId;
        private String jobOpeningTitle;
        private UUID candidateId;
        private String candidateName;
        private String candidateEmail;
        private String candidatePhone;
        private UUID channelId;
        private UUID referrerId;
        private String coverLetter;
        private String customCvUrl;
        private ApplicationStage currentStage;
        private BigDecimal aiMatchingScore;
        private String aiSummary;
        private LocalDateTime aiScreenedAt;
        private Boolean isRejected;
        private String rejectionReason;
        private LocalDateTime rejectedAt;
        private Boolean isWithdrawn;
        private String withdrawalReason;
        private LocalDateTime withdrawnAt;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FilterRequest {
        private UUID companyId;
        private UUID jobOpeningId;
        private UUID candidateId;
        private ApplicationStage currentStage;
        private Boolean isRejected;
        private Boolean isWithdrawn;
        private BigDecimal minAiScore;
        private String keyword;
        @Builder.Default
        private int page = 0;
        @Builder.Default
        private int size = 20;
    }
}
