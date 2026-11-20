package com.cyclosa.payroll.entity;

import com.cyclosa.common.entity.BaseEntity;
import com.cyclosa.payroll.enums.PayrollPeriodStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "payroll_periods", indexes = {
        @Index(name = "idx_payroll_periods_company", columnList = "company_id"),
        @Index(name = "idx_payroll_periods_status", columnList = "status")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uk_payroll_periods_company_code", columnNames = {"company_id", "code"}),
        @UniqueConstraint(name = "uk_payroll_periods_timesheet", columnNames = {"timesheet_period_id"})
})
@SQLDelete(sql = "UPDATE payroll_periods SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PayrollPeriod extends BaseEntity {

    @Column(name = "company_id", nullable = false)
    private UUID companyId;

    @Column(name = "code", nullable = false, length = 50)
    private String code;

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "planned_payment_date", nullable = false)
    private LocalDate plannedPaymentDate;

    @Column(name = "standard_work_days", nullable = false, precision = 5, scale = 2)
    private BigDecimal standardWorkDays;

    @Column(name = "timesheet_period_id", nullable = false)
    private UUID timesheetPeriodId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    @Builder.Default
    private PayrollPeriodStatus status = PayrollPeriodStatus.OPEN;

    @Column(name = "note", length = 500)
    private String note;
}

