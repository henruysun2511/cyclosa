package com.cyclosa.onboarding.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

public class ItAccountTypeDto {

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Yêu cầu tạo loại tài khoản CNTT mới")
    public static class CreateRequest {
        @NotNull(message = "Công ty không được để trống")
        private UUID companyId;

        @NotBlank(message = "Tên loại tài khoản không được để trống")
        private String name;

        private String description;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Yêu cầu cập nhật loại tài khoản CNTT")
    public static class UpdateRequest {
        @NotBlank(message = "Tên loại tài khoản không được để trống")
        private String name;

        private String description;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Thông tin phản hồi loại tài khoản CNTT")
    public static class Response {
        private UUID id;
        private UUID companyId;
        private String name;
        private String description;
        private LocalDateTime createdAt;
    }
}

