package com.cyclosa.document.entity;

import com.cyclosa.common.entity.BaseEntity;
import com.cyclosa.document.enums.DestructionStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "destruction_proposals", indexes = {
        @Index(name = "idx_destruction_proposals_company", columnList = "company_id"),
        @Index(name = "idx_destruction_proposals_status", columnList = "status")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE destruction_proposals SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class DestructionProposal extends BaseEntity {

    @Column(name = "company_id", nullable = false)
    private UUID companyId;

    @Column(name = "proposal_code", nullable = false, length = 50)
    private String proposalCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "retention_policy_id")
    private RetentionPolicy retentionPolicy;

    @Column(name = "proposed_by_employee_id", nullable = false)
    private UUID proposedByEmployeeId;

    @Column(name = "reason", nullable = false, columnDefinition = "TEXT")
    private String reason;

    @Column(name = "proposed_at", nullable = false)
    @Builder.Default
    private LocalDateTime proposedAt = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    @Builder.Default
    private DestructionStatus status = DestructionStatus.DRAFT;

    @Column(name = "required_approval_ratio", precision = 5, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal requiredApprovalRatio = new BigDecimal("100.00");

    // Thực thi
    @Column(name = "executed_by_user_id")
    private UUID executedByUserId;

    @Column(name = "executed_at")
    private LocalDateTime executedAt;

    @Column(name = "evidence_file_url", length = 500)
    private String evidenceFileUrl;

    @Column(name = "certificate_sha256", length = 64)
    private String certificateSha256;

    @OneToMany(mappedBy = "proposal", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<DestructionProposalItem> items = new ArrayList<>();

    @OneToMany(mappedBy = "proposal", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<DestructionCouncilMember> councilMembers = new ArrayList<>();
}
