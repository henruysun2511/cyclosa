package com.cyclosa.attendance.entity;

import com.cyclosa.attendance.enums.OvertimeDayType;
import com.cyclosa.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;

@Entity
@Table(name = "timesheet_snapshot_overtime", indexes = {
        @Index(name = "idx_ts_snap_ot_type", columnList = "snapshot_id, overtime_day_type")
})
@SQLDelete(sql = "UPDATE timesheet_snapshot_overtime SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TimesheetSnapshotOvertime extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "snapshot_id", nullable = false)
    private TimesheetSnapshot snapshot;

    @Enumerated(EnumType.STRING)
    @Column(name = "overtime_day_type", nullable = false, length = 20)
    private OvertimeDayType overtimeDayType;

    @Column(name = "is_night_work", nullable = false)
    @Builder.Default
    private Boolean isNightWork = false;

    @Column(name = "hours", nullable = false, precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal hours = BigDecimal.ZERO;
}

