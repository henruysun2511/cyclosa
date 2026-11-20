package com.cyclosa.document.entity;

import com.cyclosa.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDate;

@Entity
@Table(name = "destruction_proposal_items", indexes = {
        @Index(name = "idx_destruct_items_proposal", columnList = "proposal_id"),
        @Index(name = "idx_destruct_items_doc", columnList = "document_id")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uq_destruct_prop_items", columnNames = {"proposal_id", "document_id"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE destruction_proposal_items SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class DestructionProposalItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proposal_id", nullable = false)
    private DestructionProposal proposal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id", nullable = false)
    private Document document;

    @Column(name = "retention_until")
    private LocalDate retentionUntil;
}
