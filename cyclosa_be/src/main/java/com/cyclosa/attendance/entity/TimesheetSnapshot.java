package com.cyclosa.attendance.entity;

import com.cyclosa.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "timesheet_snapshots", indexes = {
        @Index(name = "idx_ts_snap_period", columnList = "timesheet_period_id"),
        @Index(name = "idx_ts_snap_emp", columnList = "employee_id")
})
@SQLDelete(sql = "UPDATE timesheet_snapshots SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TimesheetSnapshot extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "timesheet_period_id", nullable = false)
    private TimesheetPeriod timesheetPeriod;

    @Column(name = "employee_id", nullable = false)
    private UUID employeeId;

    @Column(name = "actual_work_days", nullable = false, precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal actualWorkDays = BigDecimal.ZERO;

    @Column(name = "paid_leave_days", nullable = false, precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal paidLeaveDays = BigDecimal.ZERO;

    @Column(name = "unpaid_leave_days", nullable = false, precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal unpaidLeaveDays = BigDecimal.ZERO;

    @Column(name = "social_insurance_leave_days", nullable = false, precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal socialInsuranceLeaveDays = BigDecimal.ZERO;

    @Column(name = "late_early_minutes", nullable = false)
    @Builder.Default
    private Integer lateEarlyMinutes = 0;

    @Column(name = "missing_punch_count", nullable = false)
    @Builder.Default
    private Integer missingPunchCount = 0;

    @OneToMany(mappedBy = "snapshot", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<TimesheetSnapshotOvertime> overtimeDetails = new ArrayList<>();
}

