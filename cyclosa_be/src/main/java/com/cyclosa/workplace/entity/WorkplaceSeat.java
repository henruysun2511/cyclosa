package com.cyclosa.workplace.entity;

import com.cyclosa.common.entity.BaseEntity;
import com.cyclosa.workplace.enums.SeatShape;
import com.cyclosa.workplace.enums.SeatStatus;
import com.cyclosa.workplace.enums.SeatType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "workplace_seats", indexes = {
        @Index(name = "idx_workplace_seats_row_id", columnList = "seat_row_id"),
        @Index(name = "idx_workplace_seats_type", columnList = "seat_type"),
        @Index(name = "idx_workplace_seats_status", columnList = "status")
})
@SQLDelete(sql = "UPDATE workplace_seats SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkplaceSeat extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seat_row_id", nullable = false)
    private WorkplaceSeatRow seatRow;

    @Column(name = "seat_code", nullable = false, length = 100, unique = true)
    private String seatCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "seat_type", nullable = false, length = 20)
    @Builder.Default
    private SeatType seatType = SeatType.DEDICATED;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private SeatStatus status = SeatStatus.IN_SERVICE;

    @Column(name = "x", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal x = BigDecimal.ZERO;

    @Column(name = "y", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal y = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(name = "shape", nullable = false, length = 20)
    @Builder.Default
    private SeatShape shape = SeatShape.RECTANGLE;

    @Column(name = "width", nullable = false, precision = 8, scale = 2)
    @Builder.Default
    private BigDecimal width = BigDecimal.valueOf(60);

    @Column(name = "height", nullable = false, precision = 8, scale = 2)
    @Builder.Default
    private BigDecimal height = BigDecimal.valueOf(40);

    @Column(name = "rotation_degrees", nullable = false, precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal rotationDegrees = BigDecimal.ZERO;

    @Column(name = "qr_token", nullable = false, length = 100, unique = true)
    private String qrToken;

    @ManyToMany
    @JoinTable(
            name = "workplace_seat_amenities",
            joinColumns = @JoinColumn(name = "seat_id"),
            inverseJoinColumns = @JoinColumn(name = "amenity_id")
    )
    @Builder.Default
    private Set<WorkplaceAmenity> amenities = new HashSet<>();

    @OneToMany(mappedBy = "seat", cascade = CascadeType.ALL)
    @Builder.Default
    private List<WorkplaceSeatAssignment> assignments = new ArrayList<>();

    @OneToMany(mappedBy = "seat", cascade = CascadeType.ALL)
    @Builder.Default
    private List<WorkplaceSeatAsset> seatAssets = new ArrayList<>();
}
