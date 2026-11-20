package com.cyclosa.document.entity;

import com.cyclosa.common.entity.BaseEntity;
import com.cyclosa.document.enums.OcrStatus;
import com.cyclosa.document.enums.SourceQualityStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "document_source_files", indexes = {
        @Index(name = "idx_doc_source_company", columnList = "company_id"),
        @Index(name = "idx_doc_source_quality", columnList = "quality_status"),
        @Index(name = "idx_doc_source_ocr", columnList = "ocr_status")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE document_source_files SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class DocumentSourceFile extends BaseEntity {

    @Column(name = "company_id", nullable = false)
    private UUID companyId;

    @Column(name = "file_id")
    private UUID fileId;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "file_path", nullable = false, length = 500)
    private String filePath;

    @Column(name = "file_size", nullable = false)
    private Long fileSize;

    @Column(name = "mime_type", nullable = false, length = 100)
    private String mimeType;

    @Column(name = "dpi")
    private Integer dpi; // Thông tư 05 yêu cầu >= 300 DPI

    @Column(name = "total_pages", nullable = false)
    @Builder.Default
    private Integer totalPages = 1;

    @Enumerated(EnumType.STRING)
    @Column(name = "quality_status", nullable = false, length = 30)
    @Builder.Default
    private SourceQualityStatus qualityStatus = SourceQualityStatus.PENDING_CHECK;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "ocr_raw_text", columnDefinition = "TEXT")
    private String ocrRawText;

    @Enumerated(EnumType.STRING)
    @Column(name = "ocr_status", nullable = false, length = 30)
    @Builder.Default
    private OcrStatus ocrStatus = OcrStatus.PENDING;

    @Column(name = "uploaded_by_user_id")
    private UUID uploadedByUserId;

    @Column(name = "uploaded_at", nullable = false)
    @Builder.Default
    private LocalDateTime uploadedAt = LocalDateTime.now();
}
