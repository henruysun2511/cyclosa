package com.cyclosa.asset.entity;

import com.cyclosa.asset.enums.AssetCondition;
import com.cyclosa.common.entity.BaseEntity;
import com.cyclosa.employee.entity.Employee;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "asset_assignments", indexes = {
        @Index(name = "idx_asset_assign_asset_id", columnList = "asset_id"),
        @Index(name = "idx_asset_assign_employee_id", columnList = "employee_id"),
        @Index(name = "idx_asset_assign_returned_at", columnList = "returned_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssetAssignment extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asset_id", nullable = false)
    private Asset asset;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "assigned_at", nullable = false)
    private LocalDateTime assignedAt;

    @Column(name = "returned_at")
    private LocalDateTime returnedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "condition_on_assign", length = 50)
    private AssetCondition conditionOnAssign;

    @Enumerated(EnumType.STRING)
    @Column(name = "condition_on_return", length = 50)
    private AssetCondition conditionOnReturn;

    @Column(name = "notes", length = 500)
    private String notes;

    public boolean isActive() {
        return returnedAt == null;
    }
}
