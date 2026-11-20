package com.cyclosa.document.repository;

import com.cyclosa.document.entity.DocumentLegalHold;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DocumentLegalHoldRepository extends JpaRepository<DocumentLegalHold, UUID>, JpaSpecificationExecutor<DocumentLegalHold> {
    List<DocumentLegalHold> findAllByDocumentIdOrderByPlacedAtDesc(UUID documentId);
    Optional<DocumentLegalHold> findByIdAndCompanyId(UUID id, UUID companyId);
    boolean existsByDocumentIdAndReleasedAtIsNull(UUID documentId);
    boolean existsByCompanyIdAndHoldCode(UUID companyId, String holdCode);
}
