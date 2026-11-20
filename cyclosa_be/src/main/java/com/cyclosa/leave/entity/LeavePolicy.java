package com.cyclosa.leave.entity;

import com.cyclosa.common.entity.BaseEntity;
import com.cyclosa.contract.entity.enums.ContractType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "leave_policies", uniqueConstraints = {
        @UniqueConstraint(name = "uq_leave_policies_eff", columnNames = {"company_id", "leave_type_id", "contract_type", "effective_from"})
})
@SQLDelete(sql = "UPDATE leave_policies SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeavePolicy extends BaseEntity {

    @Column(name = "company_id", nullable = false)
    private UUID companyId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "leave_type_id", nullable = false)
    private LeaveType leaveType;

    @Enumerated(EnumType.STRING)
    @Column(name = "contract_type", length = 30)
    private ContractType contractType;

    @Column(name = "effective_from", nullable = false)
    private LocalDate effectiveFrom;

    @Column(name = "annual_entitlement_days", precision = 4, scale = 1, nullable = false)
    private BigDecimal annualEntitlementDays;

    @Column(name = "seniority_step_years")
    private Integer seniorityStepYears;

    @Column(name = "seniority_bonus_days", precision = 3, scale = 1)
    private BigDecimal seniorityBonusDays;

    @Builder.Default
    @Column(name = "max_carryover_days", precision = 4, scale = 1, nullable = false)
    private BigDecimal maxCarryoverDays = BigDecimal.ZERO;

    @Column(name = "carryover_deadline_month")
    private Short carryoverDeadlineMonth;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
}

