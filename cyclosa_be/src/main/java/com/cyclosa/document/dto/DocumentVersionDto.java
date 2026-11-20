package com.cyclosa.document.dto;

import com.cyclosa.document.enums.DocumentFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

public class DocumentVersionDto {

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Yêu cầu tạo phiên bản mới của tài liệu")
    public static class CreateVersionRequest {
        @Schema(description = "ID tệp nguồn mới tải lên")
        private UUID sourceFileId;

        @NotBlank(message = "Đường dẫn tệp không được để trống")
        @Schema(description = "URL tệp phiên bản mới", example = "https://minio.../doc_v2.pdf")
        private String fileUrl;

        @Schema(description = "Định dạng tệp", example = "PDF_A")
        @Builder.Default
        private DocumentFormat fileFormat = DocumentFormat.PDF_A;

        @Schema(description = "Kích thước tệp (bytes)", example = "1048576")
        @Builder.Default
        private Long fileSize = 0L;

        @NotBlank(message = "Mã băm SHA-256 không được để trống")
        @Schema(description = "Mã băm toàn vẹn SHA-256", example = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855")
        private String sha256Checksum;

        @Schema(description = "Trang bắt đầu", example = "1")
        @Builder.Default
        private Integer pageFrom = 1;

        @Schema(description = "Trang kết thúc", example = "1")
        @Builder.Default
        private Integer pageTo = 1;

        @NotBlank(message = "Lý do thay đổi phiên bản không được để trống")
        @Schema(description = "Lý do tải phiên bản mới", example = "Thay thế bản scan bị mờ trang 2")
        private String changeReason;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Thông tin phiên bản tài liệu")
    public static class Response {
        private UUID id;
        private UUID documentId;
        private Integer versionNo;
        private UUID sourceFileId;
        private String fileUrl;
        private DocumentFormat fileFormat;
        private Long fileSize;
        private String sha256Checksum;
        private Integer pageFrom;
        private Integer pageTo;
        private String changeReason;
        private Boolean isCurrent;
        private LocalDateTime createdAt;
    }
}
