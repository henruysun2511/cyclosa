package com.cyclosa.onboarding.dto;

import com.cyclosa.common.dto.request.BaseFilterRequest;
import com.cyclosa.onboarding.enums.OnboardingStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class OnboardingProcessDto {

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Yêu cầu khởi tạo tiến trình hội nhập cho nhân viên mới")
    public static class CreateRequest {
        @NotNull(message = "Nhân viên không được để trống")
        private UUID employeeId;

        @NotNull(message = "Mẫu checklist không được để trống")
        private UUID templateId;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Thông tin phản hồi tiến trình hội nhập tổng quan")
    public static class Response {
        private UUID id;
        private UUID employeeId;
        private String employeeCode;
        private String employeeName;
        private String employeeEmail;
        private UUID departmentId;
        private String departmentName;
        private UUID jobTitleId;
        private String jobTitleName;
        private UUID templateId;
        private String templateName;
        private LocalDateTime startedAt;
        private OnboardingStatus status;
        private LocalDateTime completedAt;
        private UUID acceptedByEmployeeId;
        private String acceptedByName;
        private Integer totalTasks;
        private Integer completedTasks;
        private Integer progressPercent;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Thông tin chi tiết tiến trình hội nhập kèm danh sách công việc")
    public static class DetailResponse {
        private Response summary;
        private UUID buddyEmployeeId;
        private String buddyName;
        private String buddyEmail;
        private String buddyPhone;
        @Builder.Default
        private List<OnboardingTaskDto.Response> tasks = new ArrayList<>();
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Tham số lọc tiến trình hội nhập")
    public static class FilterRequest extends BaseFilterRequest {
        private UUID companyId;
        private OnboardingStatus status;
        private UUID departmentId;
    }
}

