package com.cyclosa.recruitment.repository;

import com.cyclosa.recruitment.entity.CandidateEducation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CandidateEducationRepository extends JpaRepository<CandidateEducation, UUID> {

    List<CandidateEducation> findByCandidate_Id(UUID candidateId);

    void deleteByCandidate_Id(UUID candidateId);
}
