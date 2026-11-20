package com.cyclosa.recruitment.dto;

import com.cyclosa.recruitment.enums.RecruitmentRequestStatus;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public class RecruitmentRequestDto {

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {
        @NotNull(message = "Pháp nhân công ty không được để trống")
        private UUID companyId;

        @NotNull(message = "Phòng ban không được để trống")
        private UUID departmentId;

        private UUID positionId;

        @NotBlank(message = "Tiêu đề yêu cầu tuyển dụng không được để trống")
        private String title;

        @NotNull(message = "Số lượng tuyển dụng không được để trống")
        @Min(value = 1, message = "Số lượng tuyển dụng phải từ 1 người trở lên")
        private Integer quantity;

        private String reason;
        private String jobDescription;
        private String requirements;
        private BigDecimal proposedSalaryMin;
        private BigDecimal proposedSalaryMax;

        @FutureOrPresent(message = "Hạn tuyển dụng phải từ thời điểm hiện tại trở đi")
        private LocalDate targetDate;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateRequest {
        private String title;
        private Integer quantity;
        private String reason;
        private String jobDescription;
        private String requirements;
        private BigDecimal proposedSalaryMin;
        private BigDecimal proposedSalaryMax;
        private LocalDate targetDate;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private UUID id;
        private UUID companyId;
        private String requestCode;
        private UUID requesterId;
        private UUID departmentId;
        private UUID positionId;
        private String title;
        private Integer quantity;
        private String reason;
        private String jobDescription;
        private String requirements;
        private BigDecimal proposedSalaryMin;
        private BigDecimal proposedSalaryMax;
        private LocalDate targetDate;
        private RecruitmentRequestStatus status;
        private UUID workflowRequestId;
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
        private UUID departmentId;
        private UUID positionId;
        private RecruitmentRequestStatus status;
        private String keyword;
        @Builder.Default
        private int page = 0;
        @Builder.Default
        private int size = 20;
    }
}
