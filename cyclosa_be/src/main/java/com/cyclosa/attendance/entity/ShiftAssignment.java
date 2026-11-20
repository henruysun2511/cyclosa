package com.cyclosa.attendance.entity;

import com.cyclosa.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "shift_assignments", indexes = {
        @Index(name = "idx_shift_assign_emp_date", columnList = "employee_id, work_date"),
        @Index(name = "idx_shift_assign_shift_id", columnList = "shift_id"),
        @Index(name = "idx_shift_assign_date", columnList = "work_date")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uk_shift_assign_emp_date", columnNames = {"employee_id", "work_date"})
})
@SQLDelete(sql = "UPDATE shift_assignments SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShiftAssignment extends BaseEntity {

    @Column(name = "employee_id", nullable = false)
    private UUID employeeId;

    @Column(name = "work_date", nullable = false)
    private LocalDate workDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shift_id", nullable = false)
    private Shift shift;
}

