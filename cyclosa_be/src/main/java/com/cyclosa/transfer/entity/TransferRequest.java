package com.cyclosa.transfer.entity;

import com.cyclosa.common.entity.BaseEntity;
import com.cyclosa.employee.entity.Employee;
import com.cyclosa.organization.entity.Branch;
import com.cyclosa.organization.entity.Department;
import com.cyclosa.organization.entity.JobLevel;
import com.cyclosa.organization.entity.JobTitle;
import com.cyclosa.transfer.enums.TransferReason;
import com.cyclosa.transfer.enums.TransferStatus;
import com.cyclosa.transfer.enums.TransferType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "transfer_requests", indexes = {
        @Index(name = "idx_transfer_employee_id", columnList = "employee_id"),
        @Index(name = "idx_transfer_status", columnList = "status"),
        @Index(name = "idx_transfer_type", columnList = "transfer_type"),
        @Index(name = "idx_transfer_effective_date", columnList = "effective_date"),
        @Index(name = "idx_transfer_end_date", columnList = "end_date")
})
@SQLDelete(sql = "UPDATE transfer_requests SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransferRequest extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Enumerated(EnumType.STRING)
    @Column(name = "transfer_type", nullable = false, length = 40)
    private TransferType transferType;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    @Builder.Default
    private TransferStatus status = TransferStatus.DRAFT;

    // === Snapshot nguồn (Trước điều chuyển) ===
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_department_id", nullable = false)
    private Department fromDepartment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_branch_id")
    private Branch fromBranch;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_job_title_id", nullable = false)
    private JobTitle fromJobTitle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_job_level_id")
    private JobLevel fromJobLevel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_manager_id")
    private Employee fromManager;

    @Column(name = "from_base_salary", precision = 15, scale = 2)
    private BigDecimal fromBaseSalary;

    // === Đích tiếp nhận (Sau điều chuyển) ===
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_department_id", nullable = false)
    private Department toDepartment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_branch_id")
    private Branch toBranch;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_job_title_id", nullable = false)
    private JobTitle toJobTitle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_job_level_id")
    private JobLevel toJobLevel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_manager_id")
    private Employee toManager;

    @Column(name = "to_base_salary", precision = 15, scale = 2)
    private BigDecimal toBaseSalary;

    // === Thời hạn & Lý do ===
    @Column(name = "effective_date", nullable = false)
    private LocalDate effectiveDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "reason", nullable = false, length = 50)
    private TransferReason reason;

    @Column(name = "reason_detail", columnDefinition = "TEXT")
    private String reasonDetail;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    // === Đãi ngộ & Phụ cấp mới ===
    @Column(name = "has_salary_adjustment", nullable = false)
    @Builder.Default
    private Boolean hasSalaryAdjustment = false;

    @Column(name = "salary_notes", columnDefinition = "TEXT")
    private String salaryNotes;

    @OneToMany(mappedBy = "transferRequest", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<TransferAllowance> allowances = new ArrayList<>();

    // === Tích hợp Workflow & Phê duyệt ===
    @Column(name = "workflow_request_id")
    private UUID workflowRequestId;

    @Column(name = "approved_by")
    private UUID approvedBy;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    // === Thực thi & Hoàn tất ===
    @Column(name = "completed_by")
    private UUID completedBy;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "is_returned", nullable = false)
    @Builder.Default
    private Boolean isReturned = false;

    public void addAllowance(TransferAllowance allowance) {
        allowances.add(allowance);
        allowance.setTransferRequest(this);
    }

    public void removeAllowance(TransferAllowance allowance) {
        allowances.remove(allowance);
        allowance.setTransferRequest(null);
    }
}
