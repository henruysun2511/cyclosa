package com.cyclosa.recruitment.entity;

import com.cyclosa.common.entity.BaseEntity;
import com.cyclosa.recruitment.enums.ApplicationStage;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "application_stage_transitions", indexes = {
        @Index(name = "idx_app_stage_trans_app", columnList = "application_id")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE application_stage_transitions SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class ApplicationStageTransition extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @Enumerated(EnumType.STRING)
    @Column(name = "from_stage", length = 30)
    private ApplicationStage fromStage;

    @Enumerated(EnumType.STRING)
    @Column(name = "to_stage", nullable = false, length = 30)
    private ApplicationStage toStage;

    @Column(name = "transitioned_at", nullable = false)
    @Builder.Default
    private LocalDateTime transitionedAt = LocalDateTime.now();

    @Column(name = "transitioned_by_employee_id")
    private UUID transitionedByEmployeeId;

    @Column(name = "note", columnDefinition = "TEXT")
    private String note;
}
