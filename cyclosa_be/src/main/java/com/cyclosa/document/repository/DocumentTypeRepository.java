package com.cyclosa.document.repository;

import com.cyclosa.document.entity.DocumentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DocumentTypeRepository extends JpaRepository<DocumentType, UUID>, JpaSpecificationExecutor<DocumentType> {
    List<DocumentType> findAllByCompanyId(UUID companyId);
    Optional<DocumentType> findByIdAndCompanyId(UUID id, UUID companyId);
    Optional<DocumentType> findByCompanyIdAndCode(UUID companyId, String code);
    boolean existsByCompanyIdAndCode(UUID companyId, String code);
    boolean existsByCompanyIdAndCodeAndIdNot(UUID companyId, String code, UUID id);
    boolean existsByRetentionPolicyId(UUID retentionPolicyId);
}
