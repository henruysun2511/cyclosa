package com.cyclosa.recruitment.entity;

import com.cyclosa.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;

@Entity
@Table(name = "scorecard_scores", indexes = {
        @Index(name = "idx_scorecard_scores_scorecard", columnList = "scorecard_id")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uq_score_scorecard_criterion", columnNames = {"scorecard_id", "criterion_id"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE scorecard_scores SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class ScorecardScore extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scorecard_id", nullable = false)
    private InterviewScorecard scorecard;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "criterion_id", nullable = false)
    private InterviewCriterion criterion;

    @Column(name = "score", nullable = false, precision = 4, scale = 2)
    private BigDecimal score;

    @Column(name = "comment", columnDefinition = "TEXT")
    private String comment;
}
