package com.cyclosa.leave.entity;

import com.cyclosa.common.entity.BaseEntity;
import com.cyclosa.leave.enums.LeaveGroup;
import com.cyclosa.leave.enums.LeavePayer;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "leave_types", uniqueConstraints = {
        @UniqueConstraint(name = "uq_leave_type_company_code", columnNames = {"company_id", "code"})
})
@SQLDelete(sql = "UPDATE leave_types SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveType extends BaseEntity {

    @Column(name = "company_id", nullable = false)
    private UUID companyId;

    @Column(name = "code", length = 30, nullable = false)
    private String code;

    @Column(name = "name", length = 150, nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "leave_group", length = 30, nullable = false)
    private LeaveGroup leaveGroup;

    @Enumerated(EnumType.STRING)
    @Column(name = "payer", length = 30, nullable = false)
    private LeavePayer payer;

    @Column(name = "fixed_days", precision = 4, scale = 1)
    private BigDecimal fixedDays;

    @Builder.Default
    @Column(name = "requires_approval", nullable = false)
    private boolean requiresApproval = true;

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
}

