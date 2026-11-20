package com.cyclosa.recruitment.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

public class RecruitmentChannelDto {

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {
        @NotBlank(message = "Tên kênh tuyển dụng không được để trống")
        private String name;

        @NotBlank(message = "Mã kênh không được để trống")
        private String code;

        private String channelType;
        private String websiteUrl;
        private Boolean isActive;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private UUID id;
        private String name;
        private String code;
        private String channelType;
        private String websiteUrl;
        private Boolean isActive;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }
}
