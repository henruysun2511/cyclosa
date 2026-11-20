package com.cyclosa.attendance.entity;

import com.cyclosa.attendance.enums.AttendanceEventType;
import com.cyclosa.attendance.enums.VerificationResult;
import com.cyclosa.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "attendance_logs", indexes = {
        @Index(name = "idx_att_logs_tx", columnList = "transaction_code"),
        @Index(name = "idx_att_logs_emp_time", columnList = "employee_id, occurred_at"),
        @Index(name = "idx_att_logs_time", columnList = "occurred_at"),
        @Index(name = "idx_att_logs_result", columnList = "verification_result")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uk_att_logs_tx", columnNames = {"transaction_code"})
})
@SQLDelete(sql = "UPDATE attendance_logs SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceLog extends BaseEntity {

    @Column(name = "transaction_code", nullable = false, length = 64, unique = true)
    private String transactionCode;

    @Column(name = "employee_id", nullable = false)
    private UUID employeeId;

    @Column(name = "shift_assignment_id")
    private UUID shiftAssignmentId;

    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", nullable = false, length = 20)
    private AttendanceEventType eventType;

    @Column(name = "occurred_at", nullable = false)
    private Instant occurredAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "verification_result", nullable = false, length = 30)
    private VerificationResult verificationResult;

    @Column(name = "face_enrollment_id")
    private UUID faceEnrollmentId;

    @Column(name = "face_match_score", precision = 5, scale = 2)
    private BigDecimal faceMatchScore;

    @Column(name = "latitude", precision = 9, scale = 6)
    private BigDecimal latitude;

    @Column(name = "longitude", precision = 9, scale = 6)
    private BigDecimal longitude;

    @Column(name = "live_photo_file_id")
    private UUID livePhotoFileId;

    @Column(name = "device_info", length = 255)
    private String deviceInfo;

    @Column(name = "ip_address", length = 50)
    private String ipAddress;
}

