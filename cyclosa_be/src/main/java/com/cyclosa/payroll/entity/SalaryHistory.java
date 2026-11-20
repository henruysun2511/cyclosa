package com.cyclosa.payroll.entity;

import com.cyclosa.common.entity.BaseEntity;
import com.cyclosa.payroll.enums.SalaryChangeReason;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "salary_histories", indexes = {
        @Index(name = "idx_salary_histories_emp", columnList = "employee_id")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uk_salary_histories_emp_date", columnNames = {"employee_id", "effective_from"})
})
@SQLDelete(sql = "UPDATE salary_histories SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SalaryHistory extends BaseEntity {

    @Column(name = "employee_id", nullable = false)
    private UUID employeeId;

    @Column(name = "effective_from", nullable = false)
    private LocalDate effectiveFrom;

    @Column(name = "base_salary", nullable = false, precision = 18, scale = 2)
    private BigDecimal baseSalary;

    @Column(name = "insurance_salary", precision = 18, scale = 2)
    private BigDecimal insuranceSalary;

    @Enumerated(EnumType.STRING)
    @Column(name = "reason", nullable = false, length = 30)
    private SalaryChangeReason reason;

    @Column(name = "decision_no", length = 50)
    private String decisionNo;

    @Column(name = "contract_id")
    private UUID contractId;

    @Column(name = "contract_appendix_id")
    private UUID contractAppendixId;

    @Column(name = "note", length = 500)
    private String note;
}

