package com.cyclosa.document.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class DocumentTypeDto {

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Yêu cầu tạo loại tài liệu")
    public static class CreateRequest {
        @NotBlank(message = "Mã loại tài liệu không được để trống")
        @Pattern(regexp = "^[A-Z0-9_]+$", message = "Mã loại tài liệu chỉ chứa chữ in hoa, số và dấu gạch dưới")
        @Size(max = 50, message = "Mã loại tài liệu tối đa 50 ký tự")
        @Schema(description = "Mã loại tài liệu", example = "CCCD")
        private String code;

        @NotBlank(message = "Tên loại tài liệu không được để trống")
        @Size(max = 150, message = "Tên loại tài liệu tối đa 150 ký tự")
        @Schema(description = "Tên loại tài liệu", example = "Căn cước công dân")
        private String name;

        @Schema(description = "ID chính sách lưu trữ áp dụng")
        private UUID retentionPolicyId;

        @Builder.Default
        @Schema(description = "Tài liệu nhạy cảm cần bảo mật cao", example = "true")
        private Boolean isSensitive = false;

        @Schema(description = "Mô tả chi tiết")
        private String description;

        @Valid
        @Schema(description = "Danh sách trường metadata động")
        private List<DocumentMetadataFieldDto.CreateRequest> metadataFields;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Yêu cầu cập nhật loại tài liệu")
    public static class UpdateRequest {
        @NotBlank(message = "Tên loại tài liệu không được để trống")
        @Size(max = 150, message = "Tên loại tài liệu tối đa 150 ký tự")
        @Schema(description = "Tên loại tài liệu", example = "Căn cước công dân")
        private String name;

        @Schema(description = "ID chính sách lưu trữ áp dụng")
        private UUID retentionPolicyId;

        @Schema(description = "Tài liệu nhạy cảm cần bảo mật cao", example = "true")
        private Boolean isSensitive;

        @Schema(description = "Mô tả chi tiết")
        private String description;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Thông tin tóm tắt loại tài liệu")
    public static class SimpleResponse {
        private UUID id;
        private String code;
        private String name;
        private Boolean isSensitive;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Thông tin chi tiết loại tài liệu")
    public static class Response {
        private UUID id;
        private UUID companyId;
        private String code;
        private String name;
        private UUID retentionPolicyId;
        private String retentionPolicyName;
        private Integer retentionMonths;
        private Boolean isSensitive;
        private String description;
        private List<DocumentMetadataFieldDto.Response> metadataFields;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }
}
