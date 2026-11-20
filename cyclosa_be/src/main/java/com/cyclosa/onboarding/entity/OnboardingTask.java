package com.cyclosa.onboarding.entity;

import com.cyclosa.common.entity.BaseEntity;
import com.cyclosa.onboarding.enums.OnboardingTaskGroup;
import com.cyclosa.onboarding.enums.OnboardingTaskStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "onboarding_tasks", indexes = {
        @Index(name = "idx_onboarding_tasks_process", columnList = "process_id"),
        @Index(name = "idx_onboarding_tasks_status", columnList = "status"),
        @Index(name = "idx_onboarding_tasks_session", columnList = "orientation_session_id")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE onboarding_tasks SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class OnboardingTask extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "process_id", nullable = false)
    private OnboardingProcess process;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "orientation_session_id")
    private OrientationSession orientationSession;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    @Builder.Default
    private OnboardingTaskStatus status = OnboardingTaskStatus.PENDING;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "completed_by_employee_id")
    private UUID completedByEmployeeId;

    @OneToOne(mappedBy = "onboardingTask", cascade = CascadeType.ALL, orphanRemoval = true)
    private ItAccountRequest itAccountRequest;
}

