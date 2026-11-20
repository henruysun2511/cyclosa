package com.cyclosa.document.repository;

import com.cyclosa.document.entity.RetentionPolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RetentionPolicyRepository extends JpaRepository<RetentionPolicy, UUID>, JpaSpecificationExecutor<RetentionPolicy> {
    List<RetentionPolicy> findAllByCompanyIdAndIsActiveTrue(UUID companyId);
    Optional<RetentionPolicy> findByIdAndCompanyId(UUID id, UUID companyId);
    boolean existsByCompanyIdAndName(UUID companyId, String name);
    boolean existsByCompanyIdAndNameAndIdNot(UUID companyId, String name, UUID id);
}
