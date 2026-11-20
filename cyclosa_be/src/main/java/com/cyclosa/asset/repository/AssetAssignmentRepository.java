package com.cyclosa.asset.repository;

import com.cyclosa.asset.entity.AssetAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AssetAssignmentRepository extends JpaRepository<AssetAssignment, UUID>, JpaSpecificationExecutor<AssetAssignment> {

    Optional<AssetAssignment> findByAssetIdAndReturnedAtIsNull(UUID assetId);

    List<AssetAssignment> findAllByAssetIdOrderByAssignedAtDesc(UUID assetId);

    List<AssetAssignment> findAllByEmployeeIdOrderByAssignedAtDesc(UUID employeeId);

    List<AssetAssignment> findAllByEmployeeIdAndReturnedAtIsNullOrderByAssignedAtDesc(UUID employeeId);

    long countByEmployeeIdAndReturnedAtIsNull(UUID employeeId);

    @Query("SELECT aa FROM AssetAssignment aa JOIN FETCH aa.asset a JOIN FETCH a.category JOIN FETCH aa.employee e WHERE aa.employee.id = :employeeId ORDER BY aa.assignedAt DESC")
    List<AssetAssignment> findHistoryByEmployeeIdWithDetails(@Param("employeeId") UUID employeeId);

    @Query("SELECT aa FROM AssetAssignment aa JOIN FETCH aa.asset a JOIN FETCH a.category JOIN FETCH aa.employee e WHERE aa.asset.id = :assetId ORDER BY aa.assignedAt DESC")
    List<AssetAssignment> findHistoryByAssetIdWithDetails(@Param("assetId") UUID assetId);
}
