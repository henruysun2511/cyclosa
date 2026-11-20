package com.cyclosa.career.entity;

import com.cyclosa.common.entity.BaseEntity;
import com.cyclosa.employee.entity.Employee;
import com.cyclosa.organization.entity.JobTitle;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "career_simulations", indexes = {
        @Index(name = "idx_career_sim_emp", columnList = "employee_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CareerSimulation extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "start_job_title_id", nullable = false)
    private JobTitle startJobTitle;

    @Column(name = "tenure_months", nullable = false)
    private Integer tenureMonths;

    @Column(name = "title", length = 150)
    private String title;

    @OneToMany(mappedBy = "simulation", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("stepOrder ASC")
    @Builder.Default
    private List<CareerSimulationStep> steps = new ArrayList<>();
}
