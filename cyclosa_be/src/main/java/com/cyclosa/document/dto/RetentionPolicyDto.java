package com.cyclosa.document.dto;

import com.cyclosa.document.enums.RetentionStartEvent;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

public class RetentionPolicyDto {

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Yêu cầu tạo chính sách lưu trữ")
    public static class CreateRequest {
        @NotBlank(message = "Tên chính sách lưu trữ không được để trống")
        @Size(max = 150, message = "Tên chính sách tối đa 150 ký tự")
        @Schema(description = "Tên chính sách lưu trữ", example = "Hồ sơ tuyển dụng - 5 năm")
        private String name;

        @Schema(description = "Mô tả chi tiết")
        private String description;

        @NotNull(message = "Thời hạn lưu trữ không được để trống")
        @Min(value = 1, message = "Thời hạn lưu trữ tối thiểu 1 tháng")
        @Schema(description = "Thời hạn lưu trữ tính bằng tháng", example = "60")
        private Integer retentionMonths;

        @NotNull(message = "Sự kiện bắt đầu tính hạn không được để trống")
        @Schema(description = "Sự kiện kích hoạt tính hạn", example = "ARCHIVED_DATE")
        private RetentionStartEvent startEvent;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Yêu cầu cập nhật chính sách lưu trữ")
    public static class UpdateRequest {
        @NotBlank(message = "Tên chính sách lưu trữ không được để trống")
        @Size(max = 150, message = "Tên chính sách tối đa 150 ký tự")
        @Schema(description = "Tên chính sách lưu trữ", example = "Hồ sơ tuyển dụng - 5 năm")
        private String name;

        @Schema(description = "Mô tả chi tiết")
        private String description;

        @NotNull(message = "Thời hạn lưu trữ không được để trống")
        @Min(value = 1, message = "Thời hạn lưu trữ tối thiểu 1 tháng")
        @Schema(description = "Thời hạn lưu trữ tính bằng tháng", example = "60")
        private Integer retentionMonths;

        @NotNull(message = "Sự kiện bắt đầu tính hạn không được để trống")
        @Schema(description = "Sự kiện kích hoạt tính hạn", example = "ARCHIVED_DATE")
        private RetentionStartEvent startEvent;

        @NotNull(message = "Trạng thái kích hoạt không được để trống")
        @Schema(description = "Trạng thái kích hoạt", example = "true")
        private Boolean isActive;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Thông tin chính sách lưu trữ")
    public static class Response {
        private UUID id;
        private UUID companyId;
        private String name;
        private String description;
        private Integer retentionMonths;
        private RetentionStartEvent startEvent;
        private Boolean isActive;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }
}
