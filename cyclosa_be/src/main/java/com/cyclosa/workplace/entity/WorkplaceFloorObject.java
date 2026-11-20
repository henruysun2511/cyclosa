package com.cyclosa.workplace.entity;

import com.cyclosa.common.entity.BaseEntity;
import com.cyclosa.workplace.enums.FloorObjectType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;

@Entity
@Table(name = "workplace_floor_objects", indexes = {
        @Index(name = "idx_workplace_floor_objects_floor", columnList = "floor_id"),
        @Index(name = "idx_workplace_floor_objects_type", columnList = "object_type")
})
@SQLDelete(sql = "UPDATE workplace_floor_objects SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkplaceFloorObject extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "floor_id", nullable = false)
    private WorkplaceFloor floor;

    @Enumerated(EnumType.STRING)
    @Column(name = "object_type", nullable = false, length = 30)
    private FloorObjectType objectType;

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "x", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal x = BigDecimal.ZERO;

    @Column(name = "y", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal y = BigDecimal.ZERO;

    @Column(name = "width", nullable = false, precision = 8, scale = 2)
    @Builder.Default
    private BigDecimal width = BigDecimal.valueOf(80);

    @Column(name = "height", nullable = false, precision = 8, scale = 2)
    @Builder.Default
    private BigDecimal height = BigDecimal.valueOf(80);

    @Column(name = "rotation_degrees", nullable = false, precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal rotationDegrees = BigDecimal.ZERO;

    @Column(name = "qr_token", length = 100, unique = true)
    private String qrToken;

    @OneToOne(mappedBy = "floorObject", cascade = CascadeType.ALL, orphanRemoval = true)
    private WorkplaceMeetingRoom meetingRoom;
}
