package com.cyclosa.document.repository;

import com.cyclosa.document.entity.DestructionCouncilMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DestructionCouncilMemberRepository extends JpaRepository<DestructionCouncilMember, UUID> {
    List<DestructionCouncilMember> findAllByProposalId(UUID proposalId);
    Optional<DestructionCouncilMember> findByProposalIdAndMemberEmployeeId(UUID proposalId, UUID memberEmployeeId);
    boolean existsByProposalIdAndMemberEmployeeId(UUID proposalId, UUID memberEmployeeId);
}
