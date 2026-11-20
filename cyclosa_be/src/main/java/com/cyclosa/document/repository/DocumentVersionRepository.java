package com.cyclosa.document.repository;

import com.cyclosa.document.entity.DocumentVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DocumentVersionRepository extends JpaRepository<DocumentVersion, UUID> {
    List<DocumentVersion> findAllByDocumentIdOrderByVersionNoDesc(UUID documentId);
    Optional<DocumentVersion> findByDocumentIdAndIsCurrentTrue(UUID documentId);
    Optional<DocumentVersion> findByDocumentIdAndVersionNo(UUID documentId, Integer versionNo);

    @Query("SELECT COALESCE(MAX(v.versionNo), 0) FROM DocumentVersion v WHERE v.document.id = :documentId")
    Integer findMaxVersionNoByDocumentId(@Param("documentId") UUID documentId);
}
