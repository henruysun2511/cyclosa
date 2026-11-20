package com.cyclosa.document.entity;

import com.cyclosa.common.entity.BaseEntity;
import com.cyclosa.document.enums.LegalHoldReason;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "document_legal_holds", indexes = {
        @Index(name = "idx_doc_legal_holds_doc", columnList = "document_id"),
        @Index(name = "idx_doc_legal_holds_released", columnList = "released_at")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE document_legal_holds SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class DocumentLegalHold extends BaseEntity {

    @Column(name = "company_id", nullable = false)
    private UUID companyId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id", nullable = false)
    private Document document;

    @Column(name = "hold_code", nullable = false, length = 50)
    private String holdCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "reason", nullable = false, length = 30)
    private LegalHoldReason reason;

    @Column(name = "note", nullable = false, columnDefinition = "TEXT")
    private String note;

    @Column(name = "placed_by_user_id", nullable = false)
    private UUID placedByUserId;

    @Column(name = "placed_at", nullable = false)
    @Builder.Default
    private LocalDateTime placedAt = LocalDateTime.now();

    @Column(name = "released_by_user_id")
    private UUID releasedByUserId;

    @Column(name = "released_at")
    private LocalDateTime releasedAt;

    @Column(name = "release_note", columnDefinition = "TEXT")
    private String releaseNote;

    public boolean isReleased() {
        return releasedAt != null;
    }
}
