package com.cyclosa.career.entity;

import com.cyclosa.career.enums.Readiness;
import com.cyclosa.common.entity.BaseEntity;
import com.cyclosa.employee.entity.Employee;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "succession_candidates", indexes = {
        @Index(name = "idx_succ_candidate_plan", columnList = "succession_plan_id"),
        @Index(name = "idx_succ_candidate_emp", columnList = "employee_id"),
        @Index(name = "idx_succ_candidate_ready", columnList = "readiness")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SuccessionCandidate extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "succession_plan_id", nullable = false)
    private SuccessionPlan successionPlan;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Enumerated(EnumType.STRING)
    @Column(name = "readiness", nullable = false, length = 30)
    @Builder.Default
    private Readiness readiness = Readiness.READY_1_2_YEARS;

    @Column(name = "development_notes", columnDefinition = "TEXT")
    private String developmentNotes;
}
