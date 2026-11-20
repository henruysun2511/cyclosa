package com.cyclosa.onboarding.dto;

import com.cyclosa.common.dto.request.BaseFilterRequest;
import com.cyclosa.onboarding.enums.OnboardingTaskGroup;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class OnboardingTemplateDto {

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Hạng mục công việc trong mẫu checklist")
    public static class ItemRequest {
        private UUID id;

        @NotNull(message = "Nhóm công việc không được để trống")
        private OnboardingTaskGroup taskGroup;

        @NotBlank(message = "Tên hạng mục không được để trống")
        private String title;

        private String description;

        @NotNull(message = "Thứ tự thực hiện không được để trống")
        private Integer sequenceNo;

        @NotNull(message = "Trạng thái bắt buộc không được để trống")
        private Boolean isMandatory;

        private UUID documentTypeId;
        private UUID itAccountTypeId;
        private UUID assetCategoryId;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Yêu cầu tạo mẫu checklist hội nhập mới")
    public static class CreateRequest {
        @NotNull(message = "Công ty không được để trống")
        private UUID companyId;

        @NotBlank(message = "Tên mẫu checklist không được để trống")
        private String name;

        private UUID departmentId;
        private UUID jobTitleId;

        @Valid
        @Builder.Default
        private List<ItemRequest> items = new ArrayList<>();
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Yêu cầu cập nhật thông tin mẫu checklist")
    public static class UpdateRequest {
        @NotBlank(message = "Tên mẫu checklist không được để trống")
        private String name;

        private UUID departmentId;
        private UUID jobTitleId;
        private Boolean isActive;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Yêu cầu thay thế danh sách hạng mục của mẫu checklist")
    public static class UpdateItemsRequest {
        @Valid
        @NotNull(message = "Danh sách hạng mục không được để trống")
        private List<ItemRequest> items;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Chi tiết hạng mục công việc phản hồi")
    public static class ItemResponse {
        private UUID id;
        private OnboardingTaskGroup taskGroup;
        private String title;
        private String description;
        private Integer sequenceNo;
        private Boolean isMandatory;
        private UUID documentTypeId;
        private UUID itAccountTypeId;
        private String itAccountTypeName;
        private UUID assetCategoryId;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Thông tin phản hồi mẫu checklist hội nhập")
    public static class Response {
        private UUID id;
        private UUID companyId;
        private String name;
        private UUID departmentId;
        private String departmentName;
        private UUID jobTitleId;
        private String jobTitleName;
        private Boolean isActive;
        private Integer itemCount;
        private List<ItemResponse> items;
        private LocalDateTime createdAt;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Tham số lọc mẫu checklist hội nhập")
    public static class FilterRequest extends BaseFilterRequest {
        private UUID companyId;
        private UUID departmentId;
        private UUID jobTitleId;
        private Boolean isActive;
    }
}

