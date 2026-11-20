package com.cyclosa.document.entity;

import com.cyclosa.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;

@Entity
@Table(name = "document_metadata_values", indexes = {
        @Index(name = "idx_doc_meta_val_doc", columnList = "document_id"),
        @Index(name = "idx_doc_meta_val_field", columnList = "field_id")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uq_doc_meta_val_doc_field", columnNames = {"document_id", "field_id"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE document_metadata_values SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class DocumentMetadataValue extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id", nullable = false)
    private Document document;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "field_id", nullable = false)
    private DocumentMetadataField field;

    @Column(name = "value", columnDefinition = "TEXT")
    private String value;

    @Column(name = "ocr_confidence", precision = 5, scale = 4)
    @Builder.Default
    private BigDecimal ocrConfidence = BigDecimal.ONE;

    @Column(name = "is_verified", nullable = false)
    @Builder.Default
    private Boolean isVerified = false;
}
