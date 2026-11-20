package com.cyclosa.document.dto;

import com.cyclosa.document.enums.ExportFormat;
import com.cyclosa.document.enums.ExportStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

public class DossierExportRequestDto {

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Yêu cầu trích xuất & đóng gói hồ sơ (Gói DIP)")
    public static class CreateRequest {
        @NotNull(message = "ID nhân viên không được để trống")
        @Schema(description = "ID nhân viên cần xuất hồ sơ", example = "3fa85f64-5717-4562-b3fc-2c963f66afa6")
        private UUID employeeId;

        @Schema(description = "ID bộ hồ sơ cụ thể (để trống nếu xuất toàn bộ)")
        private UUID dossierId;

        @Schema(description = "Định dạng xuất", example = "PDF_A_WATERMARKED")
        @Builder.Default
        private ExportFormat exportFormat = ExportFormat.PDF_A_WATERMARKED;

        @Schema(description = "Nội dung watermark tùy chỉnh (mặc định Mã NV - Họ tên - Timestamp)")
        private String watermarkText;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Thông tin kết quả yêu cầu trích xuất hồ sơ")
    public static class Response {
        private UUID id;
        private UUID companyId;
        private UUID employeeId;
        private String employeeCode;
        private String employeeFullName;
        private UUID dossierId;
        private String dossierTitle;
        private UUID requestedByUserId;
        private ExportFormat exportFormat;
        private String watermarkText;
        private ExportStatus status;
        private String downloadUrl;
        private LocalDateTime expiresAt;
        private LocalDateTime createdAt;
    }
}
