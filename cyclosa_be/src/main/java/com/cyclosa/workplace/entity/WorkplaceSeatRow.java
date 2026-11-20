package com.cyclosa.workplace.entity;

import com.cyclosa.common.entity.BaseEntity;
import com.cyclosa.workplace.enums.RowLayoutType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "workplace_seat_rows", uniqueConstraints = {
        @UniqueConstraint(name = "uq_workplace_seat_rows_zone_code", columnNames = {"zone_id", "code"})
}, indexes = {
        @Index(name = "idx_workplace_seat_rows_zone_id", columnList = "zone_id")
})
@SQLDelete(sql = "UPDATE workplace_seat_rows SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkplaceSeatRow extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "zone_id", nullable = false)
    private WorkplaceZone zone;

    @Column(name = "code", nullable = false, length = 30)
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(name = "layout_type", nullable = false, length = 30)
    @Builder.Default
    private RowLayoutType layoutType = RowLayoutType.SINGLE_ROW;

    @Column(name = "x", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal x = BigDecimal.ZERO;

    @Column(name = "y", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal y = BigDecimal.ZERO;

    @Column(name = "rotation_degrees", nullable = false, precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal rotationDegrees = BigDecimal.ZERO;

    @OneToMany(mappedBy = "seatRow", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<WorkplaceSeat> seats = new ArrayList<>();
}
