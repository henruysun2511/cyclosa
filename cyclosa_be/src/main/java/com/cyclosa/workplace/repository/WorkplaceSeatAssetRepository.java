package com.cyclosa.workplace.repository;

import com.cyclosa.workplace.entity.WorkplaceSeatAsset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WorkplaceSeatAssetRepository extends JpaRepository<WorkplaceSeatAsset, UUID> {
    List<WorkplaceSeatAsset> findBySeatIdAndUnlinkedAtIsNull(UUID seatId);
    Optional<WorkplaceSeatAsset> findByAssetIdAndUnlinkedAtIsNull(UUID assetId);
    boolean existsByAssetIdAndUnlinkedAtIsNull(UUID assetId);
}
