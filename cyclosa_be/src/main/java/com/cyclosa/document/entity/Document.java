package com.cyclosa.document.entity;

import com.cyclosa.common.entity.BaseEntity;
import com.cyclosa.document.enums.DocumentStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "documents", indexes = {
        @Index(name = "idx_documents_company", columnList = "company_id"),
        @Index(name = "idx_documents_employee", columnList = "employee_id"),
        @Index(name = "idx_documents_dossier", columnList = "dossier_id"),
        @Index(name = "idx_documents_type", columnList = "document_type_id"),
        @Index(name = "idx_documents_status", columnList = "status"),
        @Index(name = "idx_documents_retention", columnList = "retention_until"),
        @Index(name = "idx_documents_legal_hold", columnList = "is_legal_hold")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE documents SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class Document extends BaseEntity {

    @Column(name = "company_id", nullable = false)
    private UUID companyId;

    @Column(name = "document_code", nullable = false, length = 50)
    private String documentCode;

    @Column(name = "title", nullable = false)
    private String title;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dossier_id")
    private Dossier dossier;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_type_id", nullable = false)
    private DocumentType documentType;

    @Column(name = "employee_id", nullable = false)
    private UUID employeeId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    @Builder.Default
    private DocumentStatus status = DocumentStatus.DRAFT;

    @Column(name = "is_legal_hold", nullable = false)
    @Builder.Default
    private Boolean isLegalHold = false;

    @Column(name = "issue_date")
    private LocalDate issueDate;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "retention_policy_id")
    private RetentionPolicy retentionPolicy;

    @Column(name = "retention_until")
    private LocalDate retentionUntil;

    // Thẩm định
    @Column(name = "verified_by_user_id")
    private UUID verifiedByUserId;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    // Nộp lưu kho chính thức
    @Column(name = "archived_by_user_id")
    private UUID archivedByUserId;

    @Column(name = "archived_at")
    private LocalDateTime archivedAt;

    // Ký số xác thực số hóa (Điều 9 Khoản 6 Thông tư 05/2025/TT-BNV)
    @Column(name = "is_digitally_signed", nullable = false)
    @Builder.Default
    private Boolean isDigitallySigned = false;

    @Column(name = "digitally_signed_at")
    private LocalDateTime digitallySignedAt;

    @Column(name = "signed_by_user_id")
    private UUID signedByUserId;

    @Column(name = "digital_signature_value", columnDefinition = "TEXT")
    private String digitalSignatureValue;

    // Tiêu hủy
    @Column(name = "destroyed_at")
    private LocalDateTime destroyedAt;

    @Column(name = "destruction_proposal_id")
    private UUID destructionProposalId;

    @OneToMany(mappedBy = "document", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("versionNo DESC")
    @Builder.Default
    private List<DocumentVersion> versions = new ArrayList<>();

    @OneToMany(mappedBy = "document", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<DocumentMetadataValue> metadataValues = new ArrayList<>();
}
