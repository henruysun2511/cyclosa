package com.cyclosa.leave.entity;

import com.cyclosa.common.entity.BaseEntity;
import com.cyclosa.leave.enums.DayPortion;
import com.cyclosa.leave.enums.LeaveRequestStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "leave_requests", indexes = {
        @Index(name = "idx_leave_requests_emp", columnList = "employee_id"),
        @Index(name = "idx_leave_requests_company", columnList = "company_id"),
        @Index(name = "idx_leave_requests_dates", columnList = "start_date, end_date"),
        @Index(name = "idx_leave_requests_status", columnList = "status")
})
@SQLDelete(sql = "UPDATE leave_requests SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveRequest extends BaseEntity {

    @Column(name = "company_id", nullable = false)
    private UUID companyId;

    @Column(name = "employee_id", nullable = false)
    private UUID employeeId;

    @Column(name = "requested_by_user_id", nullable = false)
    private UUID requestedByUserId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "leave_type_id", nullable = false)
    private LeaveType leaveType;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "day_portion", length = 20, nullable = false)
    private DayPortion dayPortion = DayPortion.FULL_DAY;

    @Column(name = "days_count", precision = 4, scale = 1, nullable = false)
    private BigDecimal daysCount;

    @Column(name = "reason", columnDefinition = "TEXT")
    private String reason;

    @Builder.Default
    @Column(name = "submitted_at", nullable = false)
    private LocalDateTime submittedAt = LocalDateTime.now();

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 30, nullable = false)
    private LeaveRequestStatus status = LeaveRequestStatus.PENDING_APPROVAL;

    @Column(name = "workflow_request_id")
    private UUID workflowRequestId;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;

    @Column(name = "cancelled_by")
    private UUID cancelledBy;
}

