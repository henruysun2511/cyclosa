package com.cyclosa.career.entity;

import com.cyclosa.career.enums.RiskLevel;
import com.cyclosa.common.entity.BaseEntity;
import com.cyclosa.organization.entity.Department;
import com.cyclosa.organization.entity.JobTitle;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "succession_plans", indexes = {
        @Index(name = "idx_succession_dept", columnList = "department_id"),
        @Index(name = "idx_succession_title", columnList = "job_title_id"),
        @Index(name = "idx_succession_risk", columnList = "risk_level")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SuccessionPlan extends BaseEntity {

    @Column(name = "company_id", nullable = false)
    private UUID companyId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_title_id", nullable = false)
    private JobTitle jobTitle;

    @Enumerated(EnumType.STRING)
    @Column(name = "risk_level", nullable = false, length = 30)
    @Builder.Default
    private RiskLevel riskLevel = RiskLevel.MEDIUM;

    @Column(name = "review_date", nullable = false)
    private LocalDate reviewDate;

    @OneToMany(mappedBy = "successionPlan", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SuccessionCandidate> candidates = new ArrayList<>();
}
