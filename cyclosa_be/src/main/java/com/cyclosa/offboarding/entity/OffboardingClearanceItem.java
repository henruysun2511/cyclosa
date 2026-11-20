package com.cyclosa.offboarding.entity;

import com.cyclosa.common.entity.BaseEntity;
import com.cyclosa.employee.entity.Employee;
import com.cyclosa.offboarding.enums.ClearanceStatus;
import com.cyclosa.offboarding.enums.ClearanceType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;

@Entity
@Table(name = "offboarding_clearance_items", indexes = {
        @Index(name = "idx_clearance_request_id", columnList = "offboarding_request_id"),
        @Index(name = "idx_clearance_status", columnList = "status")
})
@SQLDelete(sql = "UPDATE offboarding_clearance_items SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OffboardingClearanceItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "offboarding_request_id", nullable = false)
    private OffboardingRequest offboardingRequest;

    @Enumerated(EnumType.STRING)
    @Column(name = "clearance_type", nullable = false, length = 30)
    private ClearanceType clearanceType;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    @Builder.Default
    private ClearanceStatus status = ClearanceStatus.PENDING;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cleared_by")
    private Employee clearedBy;

    @Column(name = "cleared_at")
    private LocalDateTime clearedAt;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}
