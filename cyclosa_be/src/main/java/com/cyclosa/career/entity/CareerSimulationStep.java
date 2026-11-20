package com.cyclosa.career.entity;

import com.cyclosa.common.entity.BaseEntity;
import com.cyclosa.organization.entity.JobTitle;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "career_simulation_steps", indexes = {
        @Index(name = "idx_sim_step_sim", columnList = "simulation_id"),
        @Index(name = "idx_sim_step_title", columnList = "job_title_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CareerSimulationStep extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "simulation_id", nullable = false)
    private CareerSimulation simulation;

    @Column(name = "step_order", nullable = false)
    private Integer stepOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_title_id", nullable = false)
    private JobTitle jobTitle;

    @Column(name = "match_percent", nullable = false, precision = 5, scale = 2)
    private BigDecimal matchPercent;
}
