package com.cyclosa.workplace.entity;

import com.cyclosa.common.entity.BaseEntity;
import com.cyclosa.workplace.enums.FloorPlanStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;

@Entity
@Table(name = "workplace_floor_plans", uniqueConstraints = {
        @UniqueConstraint(name = "uq_workplace_floor_plans_version", columnNames = {"floor_id", "version_no"})
}, indexes = {
        @Index(name = "idx_workplace_floor_plans_floor_id", columnList = "floor_id"),
        @Index(name = "idx_workplace_floor_plans_status", columnList = "status")
})
@SQLDelete(sql = "UPDATE workplace_floor_plans SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkplaceFloorPlan extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "floor_id", nullable = false)
    private WorkplaceFloor floor;

    @Column(name = "version_no", nullable = false)
    private Integer versionNo;

    @Column(name = "background_file_url", length = 500)
    private String backgroundFileUrl;

    @Column(name = "canvas_width", nullable = false)
    @Builder.Default
    private Integer canvasWidth = 1920;

    @Column(name = "canvas_height", nullable = false)
    @Builder.Default
    private Integer canvasHeight = 1080;

    @Column(name = "scale_meters_per_px", nullable = false, precision = 10, scale = 6)
    @Builder.Default
    private BigDecimal scaleMetersPerPx = BigDecimal.valueOf(0.05);

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private FloorPlanStatus status = FloorPlanStatus.DRAFT;

    @Column(name = "layout_data", columnDefinition = "TEXT")
    private String layoutData;
}
