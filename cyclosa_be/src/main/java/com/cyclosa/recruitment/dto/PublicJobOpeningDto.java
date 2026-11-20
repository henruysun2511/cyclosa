package com.cyclosa.recruitment.dto;

import com.cyclosa.recruitment.enums.JobOpeningStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public class PublicJobOpeningDto {

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Thông tin chi tiết vị trí tuyển dụng công khai cho ứng viên")
    public static class Response {
        private UUID id;
        private String title;
        private UUID companyId;
        private UUID departmentId;
        private String departmentName;
        private String workLocation;
        private String employmentType;
        private String workplaceType;
        private BigDecimal salaryBandMin;
        private BigDecimal salaryBandMax;
        private Boolean isSalaryNegotiable;
        private LocalDate deadlineDate;
        private String description;
        private String requirements;
        private String benefits;
        private String landingSlug;
        private JobOpeningStatus status;
        private LocalDateTime publishedAt;
        private Integer targetQuantity;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Dữ liệu nộp hồ sơ ứng tuyển từ trang Landing Page tuyển dụng")
    public static class ApplyRequest {
        @NotBlank(message = "Họ và tên ứng viên không được để trống")
        private String fullName;

        @NotBlank(message = "Email liên hệ không được để trống")
        @Email(message = "Định dạng email không hợp lệ")
        private String email;

        @NotBlank(message = "Số điện thoại không được để trống")
        private String phone;

        private String coverLetter;
        private String linkedinUrl;

        @NotNull(message = "Bạn cần đồng ý hoặc từ chối chính sách AI sàng lọc hồ sơ")
        private Boolean aiScreeningConsent;

        private String resumeUrl;
    }
}

