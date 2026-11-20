package com.cyclosa.restructure.entity;

import com.cyclosa.common.entity.BaseEntity;
import com.cyclosa.restructure.enums.DepartmentScenarioStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.util.UUID;

@Entity
@Table(name = "scenario_departments", indexes = {
        @Index(name = "idx_scen_dept_scenario", columnList = "scenario_id"),
        @Index(name = "idx_scen_dept_parent", columnList = "parent_scenario_dept_id"),
        @Index(name = "idx_scen_dept_status", columnList = "scenario_id, status_in_scenario")
})
@SQLDelete(sql = "UPDATE scenario_departments SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScenarioDepartment extends BaseEntity {

    @Column(name = "company_id")
    private UUID companyId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scenario_id", nullable = false)
    private OrgScenario scenario;

    @Column(name = "original_department_id")
    private UUID originalDepartmentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_scenario_dept_id")
    private ScenarioDepartment parentScenarioDept;

    @Column(name = "code", nullable = false, length = 50)
    private String code;

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "manager_employee_id")
    private UUID managerEmployeeId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_in_scenario", nullable = false, length = 30)
    @Builder.Default
    private DepartmentScenarioStatus statusInScenario = DepartmentScenarioStatus.UNCHANGED;

    @Column(name = "target_headcount", nullable = false)
    @Builder.Default
    private Integer targetHeadcount = 0;

    @Column(name = "is_permission_inherited", nullable = false)
    @Builder.Default
    private Boolean isPermissionInherited = true;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
}
