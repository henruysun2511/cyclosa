package com.cyclosa.recruitment.entity;

import com.cyclosa.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.util.UUID;

@Entity
@Table(name = "interview_content_flags", indexes = {
        @Index(name = "idx_interview_content_flags_interview", columnList = "interview_id")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE interview_content_flags SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class InterviewContentFlag extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interview_id", nullable = false)
    private Interview interview;

    @Column(name = "flagged_content", nullable = false, columnDefinition = "TEXT")
    private String flaggedContent;

    @Column(name = "reason", nullable = false, columnDefinition = "TEXT")
    private String reason;

    @Column(name = "review_status", nullable = false, length = 20)
    @Builder.Default
    private String reviewStatus = "PENDING";

    @Column(name = "reviewed_by_employee_id")
    private UUID reviewedByEmployeeId;
}
