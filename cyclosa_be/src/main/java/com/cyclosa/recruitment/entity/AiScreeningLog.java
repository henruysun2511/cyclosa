package com.cyclosa.recruitment.entity;

import com.cyclosa.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.util.UUID;

@Entity
@Table(name = "ai_screening_logs", indexes = {
        @Index(name = "idx_ai_screening_logs_app", columnList = "application_id")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE ai_screening_logs SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class AiScreeningLog extends BaseEntity {

    @Column(name = "application_id", nullable = false)
    private UUID applicationId;

    @Column(name = "redacted_input", nullable = false, columnDefinition = "TEXT")
    private String redactedInput;

    @Column(name = "ai_output", nullable = false, columnDefinition = "TEXT")
    private String aiOutput;

    @Column(name = "model_name", length = 100)
    private String modelName;

    @Column(name = "triggered_by_user_id")
    private UUID triggeredByUserId;
}
