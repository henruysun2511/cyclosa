package com.cyclosa.asset.repository;

import com.cyclosa.asset.entity.AssetCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AssetCategoryRepository extends JpaRepository<AssetCategory, UUID>, JpaSpecificationExecutor<AssetCategory> {

    Optional<AssetCategory> findByCompanyIdAndCode(UUID companyId, String code);

    Optional<AssetCategory> findByCompanyIdAndName(UUID companyId, String name);

    boolean existsByCompanyIdAndCode(UUID companyId, String code);

    boolean existsByCompanyIdAndName(UUID companyId, String name);

    boolean existsByCompanyIdAndCodeAndIdNot(UUID companyId, String code, UUID id);

    boolean existsByCompanyIdAndNameAndIdNot(UUID companyId, String name, UUID id);

    List<AssetCategory> findAllByCompanyIdOrderByNameAsc(UUID companyId);
}
