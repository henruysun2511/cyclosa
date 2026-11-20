package com.cyclosa.asset.repository;

import com.cyclosa.asset.entity.Asset;
import com.cyclosa.asset.enums.AssetStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AssetRepository extends JpaRepository<Asset, UUID>, JpaSpecificationExecutor<Asset> {

    Optional<Asset> findByCompanyIdAndAssetCode(UUID companyId, String assetCode);

    boolean existsByCompanyIdAndAssetCode(UUID companyId, String assetCode);

    boolean existsByCompanyIdAndAssetCodeAndIdNot(UUID companyId, String assetCode, UUID id);

    boolean existsByCategoryId(UUID categoryId);

    long countByCompanyId(UUID companyId);

    long countByCompanyIdAndStatus(UUID companyId, AssetStatus status);

    @Query("SELECT COALESCE(SUM(a.purchasePrice), 0) FROM Asset a WHERE a.companyId = :companyId")
    BigDecimal sumPurchasePriceByCompanyId(@Param("companyId") UUID companyId);

    @Query("SELECT a FROM Asset a JOIN FETCH a.category LEFT JOIN FETCH a.assignments WHERE a.id = :id")
    Optional<Asset> findByIdWithDetails(@Param("id") UUID id);
}
