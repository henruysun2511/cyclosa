package com.cyclosa.recruitment.repository;

import com.cyclosa.recruitment.entity.TalentPoolEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TalentPoolEntryRepository extends JpaRepository<TalentPoolEntry, UUID> {

    Optional<TalentPoolEntry> findByCandidate_Id(UUID candidateId);

    boolean existsByCandidate_Id(UUID candidateId);
}
