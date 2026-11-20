package com.cyclosa.attendance.entity;

import com.cyclosa.attendance.enums.AttendanceRequestStatus;
import com.cyclosa.attendance.enums.AttendanceRequestType;
import com.cyclosa.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "attendance_requests", indexes = {
        @Index(name = "idx_att_req_emp_date", columnList = "employee_id, work_date"),
        @Index(name = "idx_att_req_status", columnList = "status"),
        @Index(name = "idx_att_req_company_id", columnList = "company_id")
})
@SQLDelete(sql = "UPDATE attendance_requests SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceRequest extends BaseEntity {

    @Column(name = "company_id", nullable = false)
    private UUID companyId;

    @Column(name = "employee_id", nullable = false)
    private UUID employeeId;

    @Column(name = "work_date", nullable = false)
    private LocalDate workDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "request_type", nullable = false, length = 30)
    private AttendanceRequestType requestType;

    @Column(name = "proposed_check_in")
    private Instant proposedCheckIn;

    @Column(name = "proposed_check_out")
    private Instant proposedCheckOut;

    @Column(name = "reason", nullable = false, columnDefinition = "TEXT")
    private String reason;

    @Column(name = "attachment_file_id")
    private UUID attachmentFileId;

    @Column(name = "submitted_at", nullable = false)
    private Instant submittedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private AttendanceRequestStatus status = AttendanceRequestStatus.PENDING;

    @Column(name = "reviewed_by_user_id")
    private UUID reviewedByUserId;

    @Column(name = "reviewed_at")
    private Instant reviewedAt;

    @Column(name = "rejection_reason", length = 500)
    private String rejectionReason;
}

