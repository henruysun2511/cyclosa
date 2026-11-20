package com.cyclosa.document.entity;

import com.cyclosa.common.entity.BaseEntity;
import com.cyclosa.document.enums.ExportFormat;
import com.cyclosa.document.enums.ExportStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "dossier_export_requests", indexes = {
        @Index(name = "idx_dossier_export_company", columnList = "company_id"),
        @Index(name = "idx_dossier_export_emp", columnList = "employee_id")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE dossier_export_requests SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class DossierExportRequest extends BaseEntity {

    @Column(name = "company_id", nullable = false)
    private UUID companyId;

    @Column(name = "employee_id", nullable = false)
    private UUID employeeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dossier_id")
    private Dossier dossier;

    @Column(name = "requested_by_user_id", nullable = false)
    private UUID requestedByUserId;

    @Enumerated(EnumType.STRING)
    @Column(name = "export_format", nullable = false, length = 20)
    @Builder.Default
    private ExportFormat exportFormat = ExportFormat.PDF_A_WATERMARKED;

    @Column(name = "watermark_text", length = 200)
    private String watermarkText;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    @Builder.Default
    private ExportStatus status = ExportStatus.PENDING;

    @Column(name = "download_url", length = 500)
    private String downloadUrl;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;
}
