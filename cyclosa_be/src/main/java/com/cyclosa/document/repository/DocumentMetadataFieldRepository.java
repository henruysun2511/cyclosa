package com.cyclosa.document.repository;

import com.cyclosa.document.entity.DocumentMetadataField;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DocumentMetadataFieldRepository extends JpaRepository<DocumentMetadataField, UUID> {
    List<DocumentMetadataField> findAllByDocumentTypeIdOrderByDisplayOrderAsc(UUID documentTypeId);
    Optional<DocumentMetadataField> findByDocumentTypeIdAndFieldKey(UUID documentTypeId, String fieldKey);
    boolean existsByDocumentTypeIdAndFieldKey(UUID documentTypeId, String fieldKey);
}
