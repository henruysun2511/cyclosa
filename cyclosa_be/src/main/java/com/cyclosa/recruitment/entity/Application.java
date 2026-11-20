package com.cyclosa.recruitment.entity;

import com.cyclosa.common.entity.BaseEntity;
import com.cyclosa.recruitment.enums.ApplicationStage;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "applications", indexes = {
        @Index(name = "idx_applications_job_stage", columnList = "job_opening_id, current_stage"),
        @Index(name = "idx_applications_candidate", columnList = "candidate_id")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE applications SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class Application extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_opening_id", nullable = false)
    private JobOpening jobOpening;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_channel_id")
    private RecruitmentChannel sourceChannel;

    @Column(name = "referrer_employee_id")
    private UUID referrerEmployeeId;

    @Column(name = "applied_at", nullable = false)
    @Builder.Default
    private LocalDateTime appliedAt = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(name = "current_stage", nullable = false, length = 30)
    @Builder.Default
    private ApplicationStage currentStage = ApplicationStage.APPLIED;

    @Column(name = "ai_match_score", precision = 5, scale = 2)
    private BigDecimal aiMatchScore;

    @Column(name = "ai_match_reasoning", columnDefinition = "TEXT")
    private String aiMatchReasoning;

    @Column(name = "ai_confidence_level", length = 20)
    private String aiConfidenceLevel;

    @Column(name = "ai_screened_at")
    private LocalDateTime aiScreenedAt;

    @Column(name = "ai_screened_requirements_version")
    private Integer aiScreenedRequirementsVersion;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ApplicationStageTransition> stageTransitions = new ArrayList<>();

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Interview> interviews = new ArrayList<>();
}
