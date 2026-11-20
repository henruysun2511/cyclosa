package com.cyclosa.assistant.repository;

import com.cyclosa.assistant.entity.KnowledgeBaseChunk;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface KnowledgeBaseChunkRepository extends JpaRepository<KnowledgeBaseChunk, UUID> {

    List<KnowledgeBaseChunk> findAllByDocumentIdOrderByChunkIndexAsc(UUID documentId);

    void deleteAllByDocumentId(UUID documentId);

    long countByDocumentId(UUID documentId);
}
