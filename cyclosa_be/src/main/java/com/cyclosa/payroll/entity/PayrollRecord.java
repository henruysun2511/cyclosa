package com.cyclosa.payroll.entity;

import com.cyclosa.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "payroll_records", indexes = {
        @Index(name = "idx_payroll_records_period", columnList = "payroll_period_id"),
        @Index(name = "idx_payroll_records_employee", columnList = "employee_id")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uk_payroll_records_period_emp", columnNames = {"payroll_period_id", "employee_id"})
})
@SQLDelete(sql = "UPDATE payroll_records SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PayrollRecord extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payroll_period_id", nullable = false)
    private PayrollPeriod payrollPeriod;

    @Column(name = "employee_id", nullable = false)
    private UUID employeeId;

    @Column(name = "timesheet_snapshot_id")
    private UUID timesheetSnapshotId;

    @Column(name = "calculated_at", nullable = false)
    @Builder.Default
    private LocalDateTime calculatedAt = LocalDateTime.now();

    @OneToMany(mappedBy = "payrollRecord", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<PayrollRecordLine> lines = new ArrayList<>();
}

