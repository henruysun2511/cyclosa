package com.cyclosa.attendance.entity;

import com.cyclosa.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "attendance_adjustments", indexes = {
        @Index(name = "idx_att_adj_req", columnList = "attendance_request_id")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uk_att_adj_req", columnNames = {"attendance_request_id"})
})
@SQLDelete(sql = "UPDATE attendance_adjustments SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceAdjustment extends BaseEntity {

    @Column(name = "company_id", nullable = false)
    private UUID companyId;

    @Column(name = "employee_id", nullable = false)
    private UUID employeeId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "attendance_request_id", nullable = false, unique = true)
    private AttendanceRequest attendanceRequest;

    @Column(name = "adjusted_check_in")
    private Instant adjustedCheckIn;

    @Column(name = "adjusted_check_out")
    private Instant adjustedCheckOut;

    @Column(name = "notes", length = 500)
    private String notes;
}

