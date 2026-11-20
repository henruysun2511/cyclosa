package com.cyclosa.payroll.entity;

import com.cyclosa.attendance.enums.OvertimeDayType;
import com.cyclosa.common.entity.BaseEntity;
import com.cyclosa.payroll.enums.InsuranceKind;
import com.cyclosa.payroll.enums.PayrollLineSource;
import com.cyclosa.payroll.enums.PayrollLineType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "payroll_record_lines", indexes = {
        @Index(name = "idx_payroll_lines_record", columnList = "payroll_record_id"),
        @Index(name = "idx_payroll_lines_type", columnList = "line_type")
})
@SQLDelete(sql = "UPDATE payroll_record_lines SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PayrollRecordLine extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payroll_record_id", nullable = false)
    private PayrollRecord payrollRecord;

    @Enumerated(EnumType.STRING)
    @Column(name = "line_type", nullable = false, length = 30)
    private PayrollLineType lineType;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(name = "overtime_day_type", length = 30)
    private OvertimeDayType overtimeDayType;

    @Column(name = "is_night_work")
    private Boolean isNightWork;

    @Enumerated(EnumType.STRING)
    @Column(name = "insurance_kind", length = 20)
    private InsuranceKind insuranceKind;

    @Column(name = "salary_component_id")
    private UUID salaryComponentId;

    @Column(name = "reward_decision_id")
    private UUID rewardDecisionId;

    @Column(name = "salary_advance_id")
    private UUID salaryAdvanceId;

    @Column(name = "discipline_case_id")
    private UUID disciplineCaseId;

    @Column(name = "quantity", precision = 10, scale = 2)
    private BigDecimal quantity;

    @Column(name = "rate", precision = 18, scale = 2)
    private BigDecimal rate;

    @Column(name = "amount", nullable = false, precision = 18, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "source", nullable = false, length = 30)
    @Builder.Default
    private PayrollLineSource source = PayrollLineSource.SYSTEM_CALCULATED;

    @Column(name = "adjustment_reason", length = 500)
    private String adjustmentReason;
}

