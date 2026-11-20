package com.cyclosa.document.repository;

import com.cyclosa.document.entity.DestructionProposal;
import com.cyclosa.document.enums.DestructionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DestructionProposalRepository extends JpaRepository<DestructionProposal, UUID>, JpaSpecificationExecutor<DestructionProposal> {
    Optional<DestructionProposal> findByIdAndCompanyId(UUID id, UUID companyId);
    boolean existsByCompanyIdAndProposalCode(UUID companyId, String proposalCode);
    List<DestructionProposal> findAllByCompanyIdAndStatus(UUID companyId, DestructionStatus status);
}
