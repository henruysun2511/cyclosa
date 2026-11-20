package com.cyclosa.payroll.entity;

import com.cyclosa.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "employee_salary_items", indexes = {
        @Index(name = "idx_emp_salary_items_emp", columnList = "employee_id"),
        @Index(name = "idx_emp_salary_items_period", columnList = "payroll_period_id")
})
@SQLDelete(sql = "UPDATE employee_salary_items SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeSalaryItem extends BaseEntity {

    @Column(name = "employee_id", nullable = false)
    private UUID employeeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "salary_component_id", nullable = false)
    private SalaryComponent salaryComponent;

    @Column(name = "amount", nullable = false, precision = 18, scale = 2)
    private BigDecimal amount;

    @Column(name = "effective_from")
    private LocalDate effectiveFrom;

    @Column(name = "effective_to")
    private LocalDate effectiveTo;

    @Column(name = "payroll_period_id")
    private UUID payrollPeriodId;

    @Column(name = "discipline_case_id")
    private UUID disciplineCaseId;

    @Column(name = "note", length = 500)
    private String note;
}

