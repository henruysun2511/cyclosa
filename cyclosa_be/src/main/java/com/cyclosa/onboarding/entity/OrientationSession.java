package com.cyclosa.onboarding.entity;

import com.cyclosa.common.entity.BaseEntity;
import com.cyclosa.onboarding.enums.OrientationSessionStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "orientation_sessions", indexes = {
        @Index(name = "idx_orientation_sessions_company", columnList = "company_id"),
        @Index(name = "idx_orientation_sessions_time", columnList = "start_time, end_time")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE orientation_sessions SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class OrientationSession extends BaseEntity {

    @Column(name = "company_id", nullable = false)
    private UUID companyId;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Column(name = "location", nullable = false, length = 255)
    private String location;

    @Column(name = "trainer_employee_id", nullable = false)
    private UUID trainerEmployeeId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private OrientationSessionStatus status = OrientationSessionStatus.SCHEDULED;
}

