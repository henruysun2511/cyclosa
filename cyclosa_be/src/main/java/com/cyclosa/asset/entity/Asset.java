package com.cyclosa.asset.entity;

import com.cyclosa.asset.enums.AssetCondition;
import com.cyclosa.asset.enums.AssetStatus;
import com.cyclosa.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "assets", indexes = {
        @Index(name = "idx_asset_company_id", columnList = "company_id"),
        @Index(name = "idx_asset_code", columnList = "asset_code"),
        @Index(name = "idx_asset_category_id", columnList = "asset_category_id"),
        @Index(name = "idx_asset_status", columnList = "status"),
        @Index(name = "idx_asset_serial_number", columnList = "serial_number")
})
@SQLDelete(sql = "UPDATE assets SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Asset extends BaseEntity {

    @Column(name = "company_id", nullable = false)
    private UUID companyId;

    @Column(name = "asset_code", nullable = false, length = 50)
    private String assetCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asset_category_id", nullable = false)
    private AssetCategory category;

    @Column(name = "name", nullable = false, length = 200)
    private String name;

    @Column(name = "serial_number", length = 100)
    private String serialNumber;

    @Column(name = "model", length = 100)
    private String model;

    @Column(name = "manufacturer", length = 100)
    private String manufacturer;

    @Column(name = "specifications", columnDefinition = "TEXT")
    private String specifications;

    @Column(name = "purchase_date")
    private LocalDate purchaseDate;

    @Column(name = "purchase_price", precision = 15, scale = 2)
    private BigDecimal purchasePrice;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    @Builder.Default
    private AssetStatus status = AssetStatus.AVAILABLE;

    @Enumerated(EnumType.STRING)
    @Column(name = "condition_status", nullable = false, length = 30)
    @Builder.Default
    private AssetCondition conditionStatus = AssetCondition.GOOD;

    @Column(name = "location", length = 200)
    private String location;

    @Column(name = "notes", length = 500)
    private String notes;

    @OneToMany(mappedBy = "asset", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<AssetAssignment> assignments = new ArrayList<>();
}
