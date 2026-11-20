package com.cyclosa.recruitment.entity;

import com.cyclosa.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.util.UUID;

@Entity
@Table(name = "interview_panelists", indexes = {
        @Index(name = "idx_interview_panelists_emp", columnList = "employee_id, interview_id")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uq_panelist_interview_employee", columnNames = {"interview_id", "employee_id"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE interview_panelists SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class InterviewPanelist extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interview_id", nullable = false)
    private Interview interview;

    @Column(name = "employee_id", nullable = false)
    private UUID employeeId;

    @Column(name = "is_lead_interviewer", nullable = false)
    @Builder.Default
    private Boolean isLeadInterviewer = false;
}
