package com.cyclosa.workplace.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "workplace_zone_boundary_points", uniqueConstraints = {
        @UniqueConstraint(name = "uq_workplace_zone_points_order", columnNames = {"zone_id", "point_order"})
}, indexes = {
        @Index(name = "idx_workplace_zone_points_zone_id", columnList = "zone_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkplaceZoneBoundaryPoint {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "zone_id", nullable = false)
    private WorkplaceZone zone;

    @Column(name = "point_order", nullable = false)
    private Integer pointOrder;

    @Column(name = "x", nullable = false, precision = 10, scale = 2)
    private BigDecimal x;

    @Column(name = "y", nullable = false, precision = 10, scale = 2)
    private BigDecimal y;
}
