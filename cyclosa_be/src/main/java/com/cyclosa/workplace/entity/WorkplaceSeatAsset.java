package com.cyclosa.workplace.entity;

import com.cyclosa.asset.entity.Asset;
import com.cyclosa.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "workplace_seat_assets", indexes = {
        @Index(name = "idx_workplace_seat_assets_seat", columnList = "seat_id"),
        @Index(name = "idx_workplace_seat_assets_asset", columnList = "asset_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkplaceSeatAsset extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seat_id", nullable = false)
    private WorkplaceSeat seat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asset_id", nullable = false)
    private Asset asset;

    @Column(name = "linked_at", nullable = false)
    @Builder.Default
    private LocalDateTime linkedAt = LocalDateTime.now();

    @Column(name = "unlinked_at")
    private LocalDateTime unlinkedAt;
}
