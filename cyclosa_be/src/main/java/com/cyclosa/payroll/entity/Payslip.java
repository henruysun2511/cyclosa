package com.cyclosa.payroll.entity;

import com.cyclosa.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "payslips", indexes = {
        @Index(name = "idx_payslips_emp", columnList = "employee_id")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uk_payslips_record", columnNames = {"payroll_record_id"})
})
@SQLDelete(sql = "UPDATE payslips SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payslip extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payroll_record_id", nullable = false)
    private PayrollRecord payrollRecord;

    @Column(name = "employee_id", nullable = false)
    private UUID employeeId;

    @Column(name = "file_id")
    private UUID fileId;

    @Column(name = "file_url", length = 500)
    private String fileUrl;

    @Column(name = "issued_at", nullable = false)
    @Builder.Default
    private LocalDateTime issuedAt = LocalDateTime.now();
}

