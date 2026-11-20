package com.cyclosa.recruitment.repository;

import com.cyclosa.recruitment.entity.CandidateWorkExperience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CandidateWorkExperienceRepository extends JpaRepository<CandidateWorkExperience, UUID> {

    List<CandidateWorkExperience> findByCandidate_IdOrderByStartDateDesc(UUID candidateId);

    void deleteByCandidate_Id(UUID candidateId);
}
