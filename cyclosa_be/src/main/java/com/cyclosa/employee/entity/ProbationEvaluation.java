package com.cyclosa.employee.entity;

import com.cyclosa.common.entity.BaseEntity;
import com.cyclosa.employee.entity.enums.ProbationResult;
import com.cyclosa.workflow.enums.WorkflowOverallStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDate;

@Entity
@Table(name = "probation_evaluations", indexes = {
        @Index(name = "idx_probation_eval_employee_id", columnList = "employee_id"),
        @Index(name = "idx_probation_eval_date", columnList = "evaluation_date")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE probation_evaluations SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class ProbationEvaluation extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Enumerated(EnumType.STRING)
    @Column(name = "result", nullable = false, length = 20)
    @Builder.Default
    private ProbationResult result = ProbationResult.PASSED;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    @Builder.Default
    private WorkflowOverallStatus status = WorkflowOverallStatus.PENDING;

    @Column(name = "evaluation_date", nullable = false)
    private LocalDate evaluationDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evaluated_by_employee_id", nullable = false)
    private Employee evaluatedBy;

    @Column(name = "comment", columnDefinition = "TEXT")
    private String comment;
}

