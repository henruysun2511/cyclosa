package com.cyclosa.workplace.entity;

import com.cyclosa.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "workplace_floors", uniqueConstraints = {
        @UniqueConstraint(name = "uq_workplace_floors_site_number", columnNames = {"site_id", "floor_number"})
}, indexes = {
        @Index(name = "idx_workplace_floors_site_id", columnList = "site_id")
})
@SQLDelete(sql = "UPDATE workplace_floors SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkplaceFloor extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "site_id", nullable = false)
    private WorkplaceSite site;

    @Column(name = "floor_number", nullable = false)
    private Integer floorNumber;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @OneToMany(mappedBy = "floor", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<WorkplaceFloorPlan> plans = new ArrayList<>();

    @OneToMany(mappedBy = "floor", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<WorkplaceZone> zones = new ArrayList<>();

    @OneToMany(mappedBy = "floor", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<WorkplaceFloorObject> objects = new ArrayList<>();
}
