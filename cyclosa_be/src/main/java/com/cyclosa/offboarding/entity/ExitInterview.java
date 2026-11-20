package com.cyclosa.offboarding.entity;

import com.cyclosa.common.entity.BaseEntity;
import com.cyclosa.employee.entity.Employee;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "exit_interviews", indexes = {
        @Index(name = "idx_exit_interview_request_id", columnList = "offboarding_request_id", unique = true)
})
@SQLDelete(sql = "UPDATE exit_interviews SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExitInterview extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "offboarding_request_id", nullable = false, unique = true)
    private OffboardingRequest offboardingRequest;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interviewer_id", nullable = false)
    private Employee interviewer;

    @Column(name = "interview_date", nullable = false)
    private LocalDate interviewDate;

    @Column(name = "primary_reason", length = 100)
    private String primaryReason;

    @Column(name = "working_environment_feedback", columnDefinition = "TEXT")
    private String workingEnvironmentFeedback;

    @Column(name = "management_feedback", columnDefinition = "TEXT")
    private String managementFeedback;

    @Column(name = "compensation_feedback", columnDefinition = "TEXT")
    private String compensationFeedback;

    @Column(name = "improvement_suggestions", columnDefinition = "TEXT")
    private String improvementSuggestions;

    @Column(name = "willing_to_recommend", nullable = false)
    @Builder.Default
    private Boolean willingToRecommend = false;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}
