package com.cyclosa.payroll.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "payroll_period_rule_versions")
@IdClass(PayrollPeriodRuleVersion.PayrollPeriodRuleVersionId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PayrollPeriodRuleVersion {

    @Id
    @Column(name = "payroll_period_id", nullable = false)
    private UUID payrollPeriodId;

    @Id
    @Column(name = "rule_version_id", nullable = false, length = 100)
    private String ruleVersionId;

    @Column(name = "rule_name", nullable = false, length = 255)
    private String ruleName;

    @Column(name = "applied_parameters", columnDefinition = "TEXT")
    private String appliedParameters;

    @Column(name = "created_at", nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PayrollPeriodRuleVersionId implements Serializable {
        private UUID payrollPeriodId;
        private String ruleVersionId;
    }
}

