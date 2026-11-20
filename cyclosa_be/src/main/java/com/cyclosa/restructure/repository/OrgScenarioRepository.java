package com.cyclosa.restructure.repository;

import com.cyclosa.restructure.entity.OrgScenario;
import com.cyclosa.restructure.enums.ScenarioStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrgScenarioRepository extends JpaRepository<OrgScenario, UUID>, JpaSpecificationExecutor<OrgScenario> {

    boolean existsByCompanyIdAndCode(UUID companyId, String code);

    Optional<OrgScenario> findByIdAndCompanyId(UUID id, UUID companyId);

    Page<OrgScenario> findByCompanyId(UUID companyId, Pageable pageable);

    long countByCompanyId(UUID companyId);

    long countByCompanyIdAndStatus(UUID companyId, ScenarioStatus status);
}
