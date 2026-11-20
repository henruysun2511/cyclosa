package com.cyclosa.performance.entity;

import com.cyclosa.common.entity.BaseEntity;
import com.cyclosa.performance.enums.GoalStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;

@Entity
@Table(name = "performance_goals", indexes = {
        @Index(name = "idx_perf_goals_review", columnList = "review_id"),
        @Index(name = "idx_perf_goals_kpi", columnList = "kpi_id")
})
@SQLDelete(sql = "UPDATE performance_goals SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PerformanceGoal extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id", nullable = false)
    private PerformanceReview review;

    @Column(name = "name", nullable = false, length = 200)
    private String name;

    @Column(name = "target_value", precision = 18, scale = 2)
    private BigDecimal targetValue;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "kpi_id")
    private Kpi kpi;

    @Column(name = "weight", nullable = false, precision = 5, scale = 2)
    private BigDecimal weight;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    @Builder.Default
    private GoalStatus status = GoalStatus.NOT_STARTED;

    @Column(name = "self_score", precision = 5, scale = 2)
    private BigDecimal selfScore;

    @Column(name = "self_comment", columnDefinition = "TEXT")
    private String selfComment;

    @Column(name = "manager_score", precision = 5, scale = 2)
    private BigDecimal managerScore;

    @Column(name = "manager_comment", columnDefinition = "TEXT")
    private String managerComment;
}
