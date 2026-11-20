package com.cyclosa.recruitment.entity;

import com.cyclosa.common.entity.BaseEntity;
import com.cyclosa.recruitment.enums.RecruitmentRequestStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "recruitment_requests", indexes = {
        @Index(name = "idx_rec_req_company", columnList = "company_id, status"),
        @Index(name = "idx_rec_req_dept", columnList = "department_id"),
        @Index(name = "idx_rec_req_requester", columnList = "requested_by_employee_id")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE recruitment_requests SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class RecruitmentRequest extends BaseEntity {

    @Column(name = "company_id", nullable = false)
    private UUID companyId;

    @Column(name = "department_id", nullable = false)
    private UUID departmentId;

    @Column(name = "job_title_id", nullable = false)
    private UUID jobTitleId;

    @Column(name = "job_level_id")
    private UUID jobLevelId;

    @Column(name = "requested_quantity", nullable = false)
    private Integer requestedQuantity;

    @Column(name = "justification", nullable = false, columnDefinition = "TEXT")
    private String justification;

    @Column(name = "target_start_date")
    private LocalDate targetStartDate;

    @Column(name = "requested_by_employee_id", nullable = false)
    private UUID requestedByEmployeeId;

    @Column(name = "requested_at", nullable = false)
    @Builder.Default
    private LocalDateTime requestedAt = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    @Builder.Default
    private RecruitmentRequestStatus status = RecruitmentRequestStatus.PENDING_APPROVAL;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;
}
