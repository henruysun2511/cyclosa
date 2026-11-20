package com.cyclosa.workplace.entity;

import com.cyclosa.common.entity.BaseEntity;
import com.cyclosa.organization.entity.Department;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "workplace_zones", indexes = {
        @Index(name = "idx_workplace_zones_floor_id", columnList = "floor_id"),
        @Index(name = "idx_workplace_zones_dept_id", columnList = "department_id")
})
@SQLDelete(sql = "UPDATE workplace_zones SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkplaceZone extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "floor_id", nullable = false)
    private WorkplaceFloor floor;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @Column(name = "color_hex", length = 10)
    @Builder.Default
    private String colorHex = "#3B82F6";

    @Column(name = "capacity", nullable = false)
    @Builder.Default
    private Integer capacity = 16;

    @Column(name = "max_capacity_ceiling", nullable = false)
    @Builder.Default
    private Integer maxCapacityCeiling = 24;

    @OneToMany(mappedBy = "zone", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("pointOrder ASC")
    @Builder.Default
    private List<WorkplaceZoneBoundaryPoint> boundaryPoints = new ArrayList<>();

    @OneToMany(mappedBy = "zone", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<WorkplaceSeatRow> seatRows = new ArrayList<>();
}
