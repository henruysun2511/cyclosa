package com.cyclosa.payroll.entity;

import com.cyclosa.common.entity.BaseEntity;
import com.cyclosa.payroll.enums.SalaryAdvanceStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "salary_advances", indexes = {
        @Index(name = "idx_salary_advances_emp", columnList = "employee_id"),
        @Index(name = "idx_salary_advances_status", columnList = "status"),
        @Index(name = "idx_salary_advances_recovery", columnList = "recovery_payroll_period_id")
})
@SQLDelete(sql = "UPDATE salary_advances SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SalaryAdvance extends BaseEntity {

    @Column(name = "company_id", nullable = false)
    private UUID companyId;

    @Column(name = "employee_id", nullable = false)
    private UUID employeeId;

    @Column(name = "amount", nullable = false, precision = 18, scale = 2)
    private BigDecimal amount;

    @Column(name = "reason", nullable = false, columnDefinition = "TEXT")
    private String reason;

    @Column(name = "requested_at", nullable = false)
    @Builder.Default
    private LocalDateTime requestedAt = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    @Builder.Default
    private SalaryAdvanceStatus status = SalaryAdvanceStatus.DRAFT;

    @Column(name = "disbursed_at")
    private LocalDateTime disbursedAt;

    @Column(name = "recovery_payroll_period_id")
    private UUID recoveryPayrollPeriodId;
}

