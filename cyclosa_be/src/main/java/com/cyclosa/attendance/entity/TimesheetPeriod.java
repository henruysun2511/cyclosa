package com.cyclosa.attendance.entity;

import com.cyclosa.attendance.enums.TimesheetPeriodStatus;
import com.cyclosa.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "timesheet_periods", indexes = {
        @Index(name = "idx_ts_period_company", columnList = "company_id"),
        @Index(name = "idx_ts_period_year_month", columnList = "year, month"),
        @Index(name = "idx_ts_period_status", columnList = "status")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uk_ts_period_comp_ym", columnNames = {"company_id", "year", "month"})
})
@SQLDelete(sql = "UPDATE timesheet_periods SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TimesheetPeriod extends BaseEntity {

    @Column(name = "company_id", nullable = false)
    private UUID companyId;

    @Column(name = "year", nullable = false)
    private Integer year;

    @Column(name = "month", nullable = false)
    private Integer month;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private TimesheetPeriodStatus status = TimesheetPeriodStatus.OPEN;

    @Column(name = "locked_at")
    private Instant lockedAt;

    @Column(name = "locked_by_user_id")
    private UUID lockedByUserId;

    @Column(name = "unlock_reason", length = 500)
    private String unlockReason;
}

