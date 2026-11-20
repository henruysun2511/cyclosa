package com.cyclosa.reward.entity;

import com.cyclosa.common.entity.BaseEntity;
import com.cyclosa.employee.entity.Employee;
import com.cyclosa.reward.enums.DisciplineForm;
import com.cyclosa.reward.enums.DisciplineStatus;
import com.cyclosa.reward.enums.ViolationCategory;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "discipline_cases", indexes = {
        @Index(name = "idx_discipline_cases_company", columnList = "company_id"),
        @Index(name = "idx_discipline_cases_employee", columnList = "employee_id"),
        @Index(name = "idx_discipline_cases_status", columnList = "status")
})
@SQLDelete(sql = "UPDATE discipline_cases SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DisciplineCase extends BaseEntity {

    @Column(name = "company_id", nullable = false)
    private UUID companyId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "violation_date", nullable = false)
    private LocalDate violationDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "violation_category", nullable = false, length = 30)
    private ViolationCategory violationCategory;

    @Column(name = "violation_description", nullable = false, columnDefinition = "TEXT")
    private String violationDescription;

    @Column(name = "rule_basis", columnDefinition = "TEXT")
    private String ruleBasis;

    @Column(name = "meeting_date")
    private LocalDate meetingDate;

    @Column(name = "meeting_note", columnDefinition = "TEXT")
    private String meetingNote;

    @Enumerated(EnumType.STRING)
    @Column(name = "discipline_form", length = 30)
    private DisciplineForm disciplineForm;

    @Column(name = "salary_extension_months")
    private Integer salaryExtensionMonths;

    @Column(name = "reason", columnDefinition = "TEXT")
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    @Builder.Default
    private DisciplineStatus status = DisciplineStatus.DRAFT;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "decided_by_employee_id")
    private Employee decidedByEmployee;

    @Column(name = "decided_at")
    private LocalDate decidedAt;

    @OneToMany(mappedBy = "disciplineCase", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<DisciplineParticipant> participants = new ArrayList<>();

    @OneToMany(mappedBy = "disciplineCase", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<DisciplineEvidence> evidences = new ArrayList<>();
}

