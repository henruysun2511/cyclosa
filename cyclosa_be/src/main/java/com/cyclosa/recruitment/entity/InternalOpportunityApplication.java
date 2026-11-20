package com.cyclosa.recruitment.entity;

import com.cyclosa.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.util.UUID;

@Entity
@Table(name = "internal_opportunity_applications", indexes = {
        @Index(name = "idx_internal_opp_app_opp", columnList = "opportunity_id"),
        @Index(name = "idx_internal_opp_app_emp", columnList = "employee_id")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uq_internal_opp_emp", columnNames = {"opportunity_id", "employee_id"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE internal_opportunity_applications SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class InternalOpportunityApplication extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "opportunity_id", nullable = false)
    private InternalOpportunity opportunity;

    @Column(name = "employee_id", nullable = false)
    private UUID employeeId;

    @Column(name = "motivation", columnDefinition = "TEXT")
    private String motivation;

    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private String status = "INTERESTED";

    @Column(name = "assigned_task", columnDefinition = "TEXT")
    private String assignedTask;

    @Column(name = "outcome_note", columnDefinition = "TEXT")
    private String outcomeNote;
}
