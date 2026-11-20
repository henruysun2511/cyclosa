package com.cyclosa.document.entity;

import com.cyclosa.common.entity.BaseEntity;
import com.cyclosa.document.enums.DocumentFormat;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.util.UUID;

@Entity
@Table(name = "document_versions", indexes = {
        @Index(name = "idx_document_versions_doc", columnList = "document_id"),
        @Index(name = "idx_document_versions_checksum", columnList = "sha256_checksum")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE document_versions SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class DocumentVersion extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id", nullable = false)
    private Document document;

    @Column(name = "version_no", nullable = false)
    private Integer versionNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_file_id")
    private DocumentSourceFile sourceFile;

    @Column(name = "file_url", nullable = false, length = 500)
    private String fileUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "file_format", nullable = false, length = 20)
    @Builder.Default
    private DocumentFormat fileFormat = DocumentFormat.PDF_A;

    @Column(name = "file_size", nullable = false)
    @Builder.Default
    private Long fileSize = 0L;

    @Column(name = "sha256_checksum", nullable = false, length = 64)
    private String sha256Checksum;

    @Column(name = "page_from", nullable = false)
    @Builder.Default
    private Integer pageFrom = 1;

    @Column(name = "page_to", nullable = false)
    @Builder.Default
    private Integer pageTo = 1;

    @Column(name = "change_reason")
    private String changeReason;

    @Column(name = "is_current", nullable = false)
    @Builder.Default
    private Boolean isCurrent = true;
}
