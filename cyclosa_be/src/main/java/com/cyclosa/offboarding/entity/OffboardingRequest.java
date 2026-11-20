package com.cyclosa.offboarding.entity;

import com.cyclosa.common.entity.BaseEntity;
import com.cyclosa.employee.entity.Employee;
import com.cyclosa.offboarding.enums.OffboardingStatus;
import com.cyclosa.offboarding.enums.OffboardingType;
import com.cyclosa.offboarding.enums.ResignationReason;
import com.cyclosa.offboarding.enums.TerminationReason;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "offboarding_requests", indexes = {
        @Index(name = "idx_offboarding_employee_id", columnList = "employee_id"),
        @Index(name = "idx_offboarding_status", columnList = "status"),
        @Index(name = "idx_offboarding_type", columnList = "type")
})
@SQLDelete(sql = "UPDATE offboarding_requests SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OffboardingRequest extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 30)
    private OffboardingType type;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    @Builder.Default
    private OffboardingStatus status = OffboardingStatus.PENDING;

    // Trường dành riêng cho Đơn xin thôi việc (Resignation)
    @Enumerated(EnumType.STRING)
    @Column(name = "resignation_reason", length = 50)
    private ResignationReason resignationReason;

    @Column(name = "notice_date")
    private LocalDate noticeDate;

    @Column(name = "desired_last_working_date")
    private LocalDate desiredLastWorkingDate;

    // Trường dành riêng cho Quyết định chấm dứt HĐLĐ (Termination)
    @Enumerated(EnumType.STRING)
    @Column(name = "termination_reason", length = 50)
    private TerminationReason terminationReason;

    @Column(name = "discipline_id")
    private UUID disciplineId;

    @Column(name = "decision_number", length = 100)
    private String decisionNumber;

    @Column(name = "decision_date")
    private LocalDate decisionDate;

    // Thông tin chung & Bàn giao
    @Column(name = "actual_last_working_date", nullable = false)
    private LocalDate actualLastWorkingDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "successor_id")
    private Employee successor;

    @Column(name = "reason_detail", columnDefinition = "TEXT")
    private String reasonDetail;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    // Phê duyệt
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private Employee approver;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @OneToMany(mappedBy = "offboardingRequest", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OffboardingClearanceItem> clearanceItems = new ArrayList<>();

    @OneToOne(mappedBy = "offboardingRequest", cascade = CascadeType.ALL, orphanRemoval = true)
    private ExitInterview exitInterview;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}
