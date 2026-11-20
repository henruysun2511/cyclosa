package com.cyclosa.onboarding.repository;

import com.cyclosa.onboarding.entity.ItAccountType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ItAccountTypeRepository extends JpaRepository<ItAccountType, UUID>, JpaSpecificationExecutor<ItAccountType> {

    List<ItAccountType> findByCompanyId(UUID companyId);

    boolean existsByCompanyIdAndNameIgnoreCase(UUID companyId, String name);

    Optional<ItAccountType> findByCompanyIdAndNameIgnoreCase(UUID companyId, String name);
}

