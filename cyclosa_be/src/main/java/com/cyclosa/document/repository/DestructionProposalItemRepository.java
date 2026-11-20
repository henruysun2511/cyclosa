package com.cyclosa.document.repository;

import com.cyclosa.document.entity.DestructionProposalItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DestructionProposalItemRepository extends JpaRepository<DestructionProposalItem, UUID> {
    List<DestructionProposalItem> findAllByProposalId(UUID proposalId);
    boolean existsByProposalIdAndDocumentId(UUID proposalId, UUID documentId);
}
