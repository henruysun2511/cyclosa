package com.cyclosa.leave.entity;

import com.cyclosa.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "leave_balances", uniqueConstraints = {
        @UniqueConstraint(name = "uq_leave_balance_emp_type_year", columnNames = {"employee_id", "leave_type_id", "year"})
})
@SQLDelete(sql = "UPDATE leave_balances SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveBalance extends BaseEntity {

    @Column(name = "company_id", nullable = false)
    private UUID companyId;

    @Column(name = "employee_id", nullable = false)
    private UUID employeeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "leave_type_id", nullable = false)
    private LeaveType leaveType;

    @Column(name = "year", nullable = false)
    private Integer year;

    @Builder.Default
    @Column(name = "entitled_days", precision = 4, scale = 1, nullable = false)
    private BigDecimal entitledDays = BigDecimal.ZERO;

    @Builder.Default
    @Column(name = "carried_over_days", precision = 4, scale = 1, nullable = false)
    private BigDecimal carriedOverDays = BigDecimal.ZERO;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
}

