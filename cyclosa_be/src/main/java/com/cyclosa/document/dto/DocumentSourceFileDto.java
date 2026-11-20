package com.cyclosa.document.dto;

import com.cyclosa.document.enums.OcrStatus;
import com.cyclosa.document.enums.SourceQualityStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

public class DocumentSourceFileDto {

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Thông tin tệp nguồn ban đầu tải lên (Gói SIP)")
    public static class Response {
        private UUID id;
        private UUID companyId;
        private UUID fileId;
        private String fileName;
        private String filePath;
        private Long fileSize;
        private String mimeType;
        private Integer dpi;
        private Integer totalPages;
        private SourceQualityStatus qualityStatus;
        private String rejectionReason;
        private String ocrRawText;
        private OcrStatus ocrStatus;
        private UUID uploadedByUserId;
        private LocalDateTime uploadedAt;
    }
}
