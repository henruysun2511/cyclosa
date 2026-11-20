package com.cyclosa.onboarding.dto;

import com.cyclosa.common.dto.request.BaseFilterRequest;
import com.cyclosa.onboarding.enums.ItAccountRequestStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

public class ItAccountRequestDto {

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Yêu cầu ghi nhận đã cấp tài khoản CNTT")
    public static class ProvisionRequest {
        @NotBlank(message = "Định danh tài khoản đã cấp (email/username) không được để trống")
        private String accountIdentifier;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Yêu cầu ghi nhận cấp tài khoản thất bại")
    public static class FailRequest {
        @NotBlank(message = "Lý do thất bại không được để trống")
        private String failureReason;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Thông tin phản hồi yêu cầu cấp tài khoản IT")
    public static class Response {
        private UUID id;
        private UUID onboardingTaskId;
        private String taskTitle;
        private UUID processId;
        private UUID employeeId;
        private String employeeCode;
        private String employeeName;
        private String departmentName;
        private UUID itAccountTypeId;
        private String itAccountTypeName;
        private ItAccountRequestStatus status;
        private String accountIdentifier;
        private LocalDateTime handledAt;
        private String failureReason;
        private LocalDateTime createdAt;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Tham số lọc yêu cầu cấp tài khoản IT")
    public static class FilterRequest extends BaseFilterRequest {
        private UUID companyId;
        private ItAccountRequestStatus status;
    }
}

