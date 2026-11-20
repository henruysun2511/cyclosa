package com.cyclosa.document.entity;

import com.cyclosa.common.entity.BaseEntity;
import com.cyclosa.document.enums.CouncilRole;
import com.cyclosa.document.enums.CouncilVote;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "destruction_council_members", indexes = {
        @Index(name = "idx_destruct_council_proposal", columnList = "proposal_id"),
        @Index(name = "idx_destruct_council_member", columnList = "member_employee_id")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uq_destruct_council_member", columnNames = {"proposal_id", "member_employee_id"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE destruction_council_members SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class DestructionCouncilMember extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proposal_id", nullable = false)
    private DestructionProposal proposal;

    @Column(name = "member_employee_id", nullable = false)
    private UUID memberEmployeeId;

    @Enumerated(EnumType.STRING)
    @Column(name = "council_role", nullable = false, length = 50)
    @Builder.Default
    private CouncilRole councilRole = CouncilRole.MEMBER;

    @Enumerated(EnumType.STRING)
    @Column(name = "vote", nullable = false, length = 20)
    @Builder.Default
    private CouncilVote vote = CouncilVote.PENDING;

    @Column(name = "voted_at")
    private LocalDateTime votedAt;

    @Column(name = "comment", columnDefinition = "TEXT")
    private String comment;
}
