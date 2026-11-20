package com.cyclosa.recruitment.repository;

import com.cyclosa.recruitment.entity.InterviewCriterion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface InterviewCriterionRepository extends JpaRepository<InterviewCriterion, UUID> {

    List<InterviewCriterion> findByInterviewRound_Id(UUID roundId);

    void deleteByInterviewRound_Id(UUID roundId);
}
