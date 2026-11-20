package com.cyclosa.recruitment.dto;

import com.cyclosa.recruitment.enums.InternalOpportunityStatus;
import com.cyclosa.recruitment.enums.InternalOpportunityType;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public class InternalOpportunityDto {

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {
        @NotNull(message = "Pháp nhân công ty không được để trống")
        private UUID companyId;

        private UUID jobOpeningId;

        @NotBlank(message = "Tiêu đề cơ hội nội bộ không được để trống")
        private String title;

        @NotNull(message = "Loại cơ hội không được để trống")
        private InternalOpportunityType opportunityType;

        @NotNull(message = "Phòng ban đích không được để trống")
        private UUID targetDepartmentId;

        private UUID targetPositionId;
        private String description;
        private String eligibilityCriteria;

        @FutureOrPresent(message = "Hạn nộp hồ sơ phải từ hôm nay trở đi")
        private LocalDate deadline;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ApplyRequest {
        @NotNull(message = "Nhân viên ứng tuyển không được để trống")
        private UUID employeeId;

        private String motivationLetter;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ApplicationResponse {
        private UUID id;
        private UUID opportunityId;
        private UUID employeeId;
        private String employeeName;
        private String employeeCode;
        private String motivationLetter;
        private String currentManagerApprovalStatus;
        private String currentManagerComment;
        private String status;
        private LocalDateTime appliedAt;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private UUID id;
        private UUID companyId;
        private String opportunityCode;
        private UUID jobOpeningId;
        private String title;
        private InternalOpportunityType opportunityType;
        private UUID targetDepartmentId;
        private UUID targetPositionId;
        private String description;
        private String eligibilityCriteria;
        private LocalDate deadline;
        private InternalOpportunityStatus status;
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
        private InternalOpportunityStatus status;
        private String keyword;
        @Builder.Default
        private int page = 0;
        @Builder.Default
        private int size = 20;
    }
}
