package com.cyclosa.performance.entity;

import com.cyclosa.common.entity.BaseEntity;
import com.cyclosa.employee.entity.Employee;
import com.cyclosa.performance.enums.PerformanceRating;
import com.cyclosa.performance.enums.ReviewStatus;
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
@Table(name = "performance_reviews", indexes = {
        @Index(name = "idx_perf_reviews_cycle", columnList = "cycle_id"),
        @Index(name = "idx_perf_reviews_employee", columnList = "employee_id"),
        @Index(name = "idx_perf_reviews_manager", columnList = "manager_employee_id")
})
@SQLDelete(sql = "UPDATE performance_reviews SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PerformanceReview extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cycle_id", nullable = false)
    private PerformanceCycle cycle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_employee_id")
    private Employee managerEmployee;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    @Builder.Default
    private ReviewStatus status = ReviewStatus.DRAFT;

    @Column(name = "self_comment", columnDefinition = "TEXT")
    private String selfComment;

    @Column(name = "manager_comment", columnDefinition = "TEXT")
    private String managerComment;

    @Column(name = "self_submitted_at")
    private LocalDateTime selfSubmittedAt;

    @Column(name = "manager_submitted_at")
    private LocalDateTime managerSubmittedAt;

    @Column(name = "final_score", precision = 5, scale = 2)
    private BigDecimal finalScore;

    @Enumerated(EnumType.STRING)
    @Column(name = "final_rating", length = 30)
    private PerformanceRating finalRating;

    @Column(name = "finalized_by_user_id")
    private UUID finalizedByUserId;

    @Column(name = "finalized_at")
    private LocalDateTime finalizedAt;

    @OneToMany(mappedBy = "review", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<PerformanceGoal> goals = new ArrayList<>();
}
