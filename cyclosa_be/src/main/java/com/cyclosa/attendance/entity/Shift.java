package com.cyclosa.attendance.entity;

import com.cyclosa.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "shifts", indexes = {
        @Index(name = "idx_shifts_company_id", columnList = "company_id"),
        @Index(name = "idx_shifts_code", columnList = "code"),
        @Index(name = "idx_shifts_is_active", columnList = "is_active")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uk_shifts_company_code", columnNames = {"company_id", "code"})
})
@SQLDelete(sql = "UPDATE shifts SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Shift extends BaseEntity {

    @Column(name = "company_id", nullable = false)
    private UUID companyId;

    @Column(name = "code", nullable = false, length = 30)
    private String code;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(name = "break_minutes", nullable = false)
    @Builder.Default
    private Integer breakMinutes = 60;

    @Column(name = "work_credit", nullable = false, precision = 3, scale = 2)
    @Builder.Default
    private BigDecimal workCredit = BigDecimal.valueOf(1.00);

    @Column(name = "late_grace_minutes", nullable = false)
    @Builder.Default
    private Integer lateGraceMinutes = 15;

    @Column(name = "early_grace_minutes", nullable = false)
    @Builder.Default
    private Integer earlyGraceMinutes = 0;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    /**
     * Ca qua đêm khi giờ kết thúc nhỏ hơn giờ bắt đầu (ví dụ: 22:00 -> 06:00)
     */
    public boolean isNightShift() {
        return endTime != null && startTime != null && endTime.isBefore(startTime);
    }
}

