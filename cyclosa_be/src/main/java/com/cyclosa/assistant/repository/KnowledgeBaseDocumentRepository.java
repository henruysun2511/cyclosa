package com.cyclosa.assistant.repository;

import com.cyclosa.assistant.entity.KnowledgeBaseDocument;
import com.cyclosa.assistant.enums.KnowledgeCategory;
import com.cyclosa.assistant.enums.KnowledgeDocumentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface KnowledgeBaseDocumentRepository extends JpaRepository<KnowledgeBaseDocument, UUID>, JpaSpecificationExecutor<KnowledgeBaseDocument> {

    List<KnowledgeBaseDocument> findAllByCompanyIdAndStatus(UUID companyId, KnowledgeDocumentStatus status);

    Page<KnowledgeBaseDocument> findAllByCompanyId(UUID companyId, Pageable pageable);

    Optional<KnowledgeBaseDocument> findByIdAndCompanyId(UUID id, UUID companyId);

    long countByCompanyIdAndStatus(UUID companyId, KnowledgeDocumentStatus status);

    long countByCompanyIdAndCategory(UUID companyId, KnowledgeCategory category);
}
