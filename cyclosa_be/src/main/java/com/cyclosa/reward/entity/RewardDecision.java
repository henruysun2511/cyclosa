package com.cyclosa.reward.entity;

import com.cyclosa.common.entity.BaseEntity;
import com.cyclosa.employee.entity.Employee;
import com.cyclosa.reward.enums.RewardType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "reward_decisions", indexes = {
        @Index(name = "idx_reward_decisions_company", columnList = "company_id"),
        @Index(name = "idx_reward_decisions_employee", columnList = "employee_id"),
        @Index(name = "idx_reward_decisions_date", columnList = "decision_date")
})
@SQLDelete(sql = "UPDATE reward_decisions SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RewardDecision extends BaseEntity {

    @Column(name = "company_id", nullable = false)
    private UUID companyId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Enumerated(EnumType.STRING)
    @Column(name = "reward_type", nullable = false, length = 30)
    private RewardType rewardType;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "reason", nullable = false, columnDefinition = "TEXT")
    private String reason;

    @Column(name = "amount", precision = 18, scale = 2)
    private BigDecimal amount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "decided_by_employee_id", nullable = false)
    private Employee decidedByEmployee;

    @Column(name = "decision_date", nullable = false)
    private LocalDate decisionDate;
}

