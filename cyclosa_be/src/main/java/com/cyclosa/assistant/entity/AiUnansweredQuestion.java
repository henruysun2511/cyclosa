package com.cyclosa.assistant.entity;

import com.cyclosa.assistant.enums.UnansweredQuestionStatus;
import com.cyclosa.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "ai_unanswered_questions", indexes = {
        @Index(name = "idx_ai_unanswered_company", columnList = "company_id"),
        @Index(name = "idx_ai_unanswered_status", columnList = "status"),
        @Index(name = "idx_ai_unanswered_cluster", columnList = "cluster_id")
})
@SQLDelete(sql = "UPDATE ai_unanswered_questions SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiUnansweredQuestion extends BaseEntity {

    @Column(name = "company_id", nullable = false)
    private UUID companyId;

    @Column(name = "message_id")
    private UUID messageId;

    @Column(name = "question_text", nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Column(name = "cluster_id")
    private UUID clusterId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    @Builder.Default
    private UnansweredQuestionStatus status = UnansweredQuestionStatus.PENDING_REVIEW;

    @Column(name = "reviewed_by")
    private UUID reviewedBy;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;
}
