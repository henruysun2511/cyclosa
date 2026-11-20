package com.cyclosa.document.dto;

import com.cyclosa.document.enums.DossierPurpose;
import com.cyclosa.document.enums.DossierStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class DossierDto {

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Yêu cầu tạo bộ hồ sơ")
    public static class CreateRequest {
        @NotNull(message = "ID nhân viên không được để trống")
        @Schema(description = "ID nhân viên sở hữu", example = "3fa85f64-5717-4562-b3fc-2c963f66afa6")
        private UUID employeeId;

        @NotBlank(message = "Mã bộ hồ sơ không được để trống")
        @Size(max = 50, message = "Mã bộ hồ sơ tối đa 50 ký tự")
        @Schema(description = "Mã bộ hồ sơ", example = "DOS-EMP-001-REC")
        private String dossierCode;

        @NotBlank(message = "Tiêu đề bộ hồ sơ không được để trống")
        @Size(max = 200, message = "Tiêu đề tối đa 200 ký tự")
        @Schema(description = "Tiêu đề bộ hồ sơ", example = "Hồ sơ tuyển dụng nhân sự")
        private String title;

        @NotNull(message = "Mục đích bộ hồ sơ không được để trống")
        @Schema(description = "Mục đích hồ sơ", example = "RECRUITMENT")
        private DossierPurpose purpose;

        @Schema(description = "Mô tả ghi chú")
        private String description;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Yêu cầu cập nhật bộ hồ sơ")
    public static class UpdateRequest {
        @NotBlank(message = "Tiêu đề bộ hồ sơ không được để trống")
        @Size(max = 200, message = "Tiêu đề tối đa 200 ký tự")
        @Schema(description = "Tiêu đề bộ hồ sơ", example = "Hồ sơ tuyển dụng nhân sự")
        private String title;

        @Schema(description = "Mục đích hồ sơ", example = "RECRUITMENT")
        private DossierPurpose purpose;

        @Schema(description = "Trạng thái", example = "ACTIVE")
        private DossierStatus status;

        @Schema(description = "Mô tả ghi chú")
        private String description;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Thông tin bộ hồ sơ tóm tắt")
    public static class Response {
        private UUID id;
        private UUID companyId;
        private UUID employeeId;
        private String employeeCode;
        private String employeeFullName;
        private String dossierCode;
        private String title;
        private DossierPurpose purpose;
        private DossierStatus status;
        private Integer documentCount;
        private LocalDateTime createdAt;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Thông tin chi tiết bộ hồ sơ")
    public static class DetailResponse {
        private UUID id;
        private UUID companyId;
        private UUID employeeId;
        private String employeeCode;
        private String employeeFullName;
        private String departmentName;
        private String positionTitle;
        private String dossierCode;
        private String title;
        private DossierPurpose purpose;
        private DossierStatus status;
        private String description;
        private List<DocumentDto.Response> documents;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }
}
