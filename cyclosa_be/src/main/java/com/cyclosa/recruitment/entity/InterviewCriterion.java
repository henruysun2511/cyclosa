package com.cyclosa.recruitment.entity;

import com.cyclosa.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;

@Entity
@Table(name = "interview_criteria", indexes = {
        @Index(name = "idx_interview_criteria_round", columnList = "interview_round_id")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE interview_criteria SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class InterviewCriterion extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interview_round_id", nullable = false)
    private InterviewRound interviewRound;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "max_score", nullable = false)
    @Builder.Default
    private Integer maxScore = 10;

    @Column(name = "weight", nullable = false, precision = 4, scale = 2)
    @Builder.Default
    private BigDecimal weight = BigDecimal.valueOf(1.0);

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
}
