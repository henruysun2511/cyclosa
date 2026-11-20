package com.cyclosa.onboarding.entity;

import com.cyclosa.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "onboarding_checklist_templates", indexes = {
        @Index(name = "idx_onboarding_templates_company", columnList = "company_id"),
        @Index(name = "idx_onboarding_templates_dept", columnList = "department_id"),
        @Index(name = "idx_onboarding_templates_job_title", columnList = "job_title_id")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE onboarding_checklist_templates SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class OnboardingChecklistTemplate extends BaseEntity {

    @Column(name = "company_id", nullable = false)
    private UUID companyId;

    @Column(name = "name", nullable = false, length = 200)
    private String name;

    @Column(name = "department_id")
    private UUID departmentId;

    @Column(name = "job_title_id")
    private UUID jobTitleId;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @OneToMany(mappedBy = "template", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sequenceNo ASC")
    @Builder.Default
    private List<OnboardingTemplateItem> items = new ArrayList<>();
}

