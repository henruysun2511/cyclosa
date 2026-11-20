package com.cyclosa.restructure.entity;

import com.cyclosa.common.entity.BaseEntity;
import com.cyclosa.restructure.enums.AssignmentStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "scenario_employee_assignments", indexes = {
        @Index(name = "idx_scen_emp_scenario_dept", columnList = "scenario_id, new_scenario_dept_id"),
        @Index(name = "idx_scen_emp_status", columnList = "scenario_id, assignment_status")
})
@SQLDelete(sql = "UPDATE scenario_employee_assignments SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScenarioEmployeeAssignment extends BaseEntity {

    @Column(name = "company_id")
    private UUID companyId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scenario_id", nullable = false)
    private OrgScenario scenario;

    @Column(name = "employee_id", nullable = false)
    private UUID employeeId;

    @Column(name = "original_department_id")
    private UUID originalDepartmentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "new_scenario_dept_id", nullable = false)
    private ScenarioDepartment newScenarioDept;

    @Column(name = "original_job_title_id")
    private UUID originalJobTitleId;

    @Column(name = "new_job_title_id", nullable = false)
    private UUID newJobTitleId;

    @Column(name = "original_manager_id")
    private UUID originalManagerId;

    @Column(name = "new_manager_id")
    private UUID newManagerId;

    @Enumerated(EnumType.STRING)
    @Column(name = "assignment_status", nullable = false, length = 30)
    @Builder.Default
    private AssignmentStatus assignmentStatus = AssignmentStatus.UNCHANGED;

    @Column(name = "proposed_salary", precision = 15, scale = 2)
    private BigDecimal proposedSalary;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
}
