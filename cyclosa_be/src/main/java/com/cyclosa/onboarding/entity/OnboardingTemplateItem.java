package com.cyclosa.onboarding.entity;

import com.cyclosa.common.entity.BaseEntity;
import com.cyclosa.onboarding.enums.OnboardingTaskGroup;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.util.UUID;

@Entity
@Table(name = "onboarding_template_items", indexes = {
        @Index(name = "idx_onboarding_items_template", columnList = "template_id"),
        @Index(name = "idx_onboarding_items_seq", columnList = "template_id, sequence_no")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE onboarding_template_items SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class OnboardingTemplateItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "template_id", nullable = false)
    private OnboardingChecklistTemplate template;

    @Enumerated(EnumType.STRING)
    @Column(name = "task_group", nullable = false, length = 30)
    private OnboardingTaskGroup taskGroup;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "sequence_no", nullable = false)
    private Integer sequenceNo;

    @Column(name = "is_mandatory", nullable = false)
    @Builder.Default
    private Boolean isMandatory = true;

    @Column(name = "document_type_id")
    private UUID documentTypeId;

    @Column(name = "it_account_type_id")
    private UUID itAccountTypeId;

    @Column(name = "asset_category_id")
    private UUID assetCategoryId;
}

