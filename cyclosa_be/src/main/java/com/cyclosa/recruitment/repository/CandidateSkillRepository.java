package com.cyclosa.recruitment.repository;

import com.cyclosa.recruitment.entity.CandidateSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CandidateSkillRepository extends JpaRepository<CandidateSkill, UUID> {

    List<CandidateSkill> findByCandidate_Id(UUID candidateId);

    void deleteByCandidate_Id(UUID candidateId);
}
