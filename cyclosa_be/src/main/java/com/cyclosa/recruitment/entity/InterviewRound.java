package com.cyclosa.recruitment.entity;

import com.cyclosa.common.entity.BaseEntity;
import com.cyclosa.recruitment.enums.InterviewRoundType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "interview_rounds", indexes = {
        @Index(name = "idx_interview_rounds_job", columnList = "job_opening_id, round_no")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE interview_rounds SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class InterviewRound extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_opening_id", nullable = false)
    private JobOpening jobOpening;

    @Column(name = "round_no", nullable = false)
    private Integer roundNo;

    @Enumerated(EnumType.STRING)
    @Column(name = "round_type", nullable = false, length = 30)
    private InterviewRoundType roundType;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @OneToMany(mappedBy = "interviewRound", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<InterviewCriterion> criteria = new ArrayList<>();
}
