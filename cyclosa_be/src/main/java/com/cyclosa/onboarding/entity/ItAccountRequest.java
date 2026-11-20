package com.cyclosa.onboarding.entity;

import com.cyclosa.common.entity.BaseEntity;
import com.cyclosa.onboarding.enums.ItAccountRequestStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;

@Entity
@Table(name = "it_account_requests", indexes = {
        @Index(name = "idx_it_requests_task", columnList = "onboarding_task_id", unique = true),
        @Index(name = "idx_it_requests_status", columnList = "status")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE it_account_requests SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class ItAccountRequest extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "onboarding_task_id", nullable = false, unique = true)
    private OnboardingTask onboardingTask;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    @Builder.Default
    private ItAccountRequestStatus status = ItAccountRequestStatus.PENDING;

    @Column(name = "account_identifier", length = 255)
    private String accountIdentifier;

    @Column(name = "handled_at")
    private LocalDateTime handledAt;

    @Column(name = "failure_reason", length = 255)
    private String failureReason;
}

