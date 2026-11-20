package com.cyclosa.recruitment.dto;

import com.cyclosa.recruitment.enums.JobPostingStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

public class JobPostingDto {

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {
        @NotNull(message = "Vị trí tuyển dụng không được để trống")
        private UUID jobOpeningId;

        @NotNull(message = "Kênh tuyển dụng không được để trống")
        private UUID channelId;

        private String externalPostingUrl;
        private LocalDateTime expiresAt;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private UUID id;
        private UUID jobOpeningId;
        private String jobOpeningTitle;
        private UUID channelId;
        private String channelName;
        private String externalPostingUrl;
        private LocalDateTime postedAt;
        private LocalDateTime expiresAt;
        private JobPostingStatus status;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }
}
