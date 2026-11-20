package com.cyclosa.onboarding.dto;

import com.cyclosa.onboarding.enums.ItAccountRequestStatus;
import com.cyclosa.onboarding.enums.OnboardingTaskGroup;
import com.cyclosa.onboarding.enums.OnboardingTaskStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

public class OnboardingTaskDto {

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Yêu cầu bổ sung công việc hội nhập ngoài mẫu")
    public static class CreateAdHocTaskRequest {
        @NotNull(message = "Nhóm công việc không được để trống")
        private OnboardingTaskGroup taskGroup;

        @NotBlank(message = "Tên công việc không được để trống")
        private String title;

        private String description;

        @NotNull(message = "Trạng thái bắt buộc không được để trống")
        private Boolean isMandatory;

        private UUID documentTypeId;
        private UUID itAccountTypeId;
        private UUID assetCategoryId;
        private UUID orientationSessionId;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Thông tin phản hồi chi tiết công việc hội nhập")
    public static class Response {
        private UUID id;
        private UUID processId;
        private OnboardingTaskGroup taskGroup;
        private String title;
        private String description;
        private Integer sequenceNo;
        private Boolean isMandatory;
        private UUID documentTypeId;
        private UUID itAccountTypeId;
        private String itAccountTypeName;
        private UUID assetCategoryId;
        private UUID orientationSessionId;
        private String orientationSessionTitle;
        private OnboardingTaskStatus status;
        private LocalDateTime completedAt;
        private UUID completedByEmployeeId;
        private String completedByName;
        private String itAccountIdentifier;
        private ItAccountRequestStatus itRequestStatus;
    }
}

