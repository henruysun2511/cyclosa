package com.cyclosa.recruitment.entity;

import com.cyclosa.common.entity.BaseEntity;
import com.cyclosa.recruitment.enums.OverallRecommendation;
import com.cyclosa.recruitment.enums.ScorecardStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "interview_scorecards", indexes = {
        @Index(name = "idx_scorecards_interview", columnList = "interview_id")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uq_scorecard_interview_interviewer", columnNames = {"interview_id", "interviewer_employee_id"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE interview_scorecards SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class InterviewScorecard extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interview_id", nullable = false)
    private Interview interview;

    @Column(name = "interviewer_employee_id", nullable = false)
    private UUID interviewerEmployeeId;

    @Enumerated(EnumType.STRING)
    @Column(name = "overall_recommendation", length = 30)
    private OverallRecommendation overallRecommendation;

    @Column(name = "general_notes", columnDefinition = "TEXT")
    private String generalNotes;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private ScorecardStatus status = ScorecardStatus.DRAFT;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @OneToMany(mappedBy = "scorecard", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ScorecardScore> scores = new ArrayList<>();
}
