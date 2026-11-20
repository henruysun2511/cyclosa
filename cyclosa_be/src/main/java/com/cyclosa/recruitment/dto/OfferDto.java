package com.cyclosa.recruitment.dto;

import com.cyclosa.recruitment.enums.OfferDeclineReason;
import com.cyclosa.recruitment.enums.OfferStatus;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class OfferDto {

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AllowanceDto {
        private UUID id;
        @NotBlank(message = "Tên phụ cấp không được để trống")
        private String name;
        @NotNull(message = "Mức phụ cấp không được để trống")
        private BigDecimal amount;
        private Boolean taxable;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {
        @NotNull(message = "Pháp nhân công ty không được để trống")
        private UUID companyId;

        @NotNull(message = "Hồ sơ ứng tuyển không được để trống")
        private UUID applicationId;

        @NotNull(message = "Ứng viên không được để trống")
        private UUID candidateId;

        @NotNull(message = "Mức lương cơ bản không được để trống")
        private BigDecimal baseSalary;

        private BigDecimal probationSalary;
        private Integer probationPeriodMonths;
        private String currency;

        @NotNull(message = "Ngày bắt đầu làm việc không được để trống")
        private LocalDate startDate;

        @NotNull(message = "Hạn phản hồi offer không được để trống")
        @FutureOrPresent(message = "Hạn phản hồi offer phải từ hôm nay trở đi")
        private LocalDate expiryDate;

        private String notes;
        private List<AllowanceDto> allowances;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateStatusRequest {
        @NotNull(message = "Trạng thái offer không được để trống")
        private OfferStatus status;

        private OfferDeclineReason declineReason;
        private String declineNotes;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private UUID id;
        private UUID companyId;
        private String offerCode;
        private UUID applicationId;
        private UUID candidateId;
        private String candidateName;
        private String candidateEmail;
        private BigDecimal baseSalary;
        private BigDecimal probationSalary;
        private Integer probationPeriodMonths;
        private String currency;
        private LocalDate startDate;
        private LocalDate expiryDate;
        private OfferStatus status;
        private OfferDeclineReason declineReason;
        private String declineNotes;
        private UUID workflowRequestId;
        private String notes;
        private List<AllowanceDto> allowances;
        private UUID employeeId;
        private String employeeCode;
        private UUID onboardingProcessId;
        private Boolean isConvertedToEmployee;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ConvertToEmployeeResponse {
        private UUID employeeId;
        private String employeeCode;
        private String employeeName;
        private UUID onboardingProcessId;
        private String message;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FilterRequest {
        private UUID companyId;
        private OfferStatus status;
        private String keyword;
        @Builder.Default
        private int page = 0;
        @Builder.Default
        private int size = 20;
    }
}
