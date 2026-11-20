package com.cyclosa.document.repository;

import com.cyclosa.document.entity.DocumentMetadataValue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DocumentMetadataValueRepository extends JpaRepository<DocumentMetadataValue, UUID> {
    List<DocumentMetadataValue> findAllByDocumentId(UUID documentId);
    Optional<DocumentMetadataValue> findByDocumentIdAndFieldId(UUID documentId, UUID fieldId);
    void deleteAllByDocumentId(UUID documentId);
}
