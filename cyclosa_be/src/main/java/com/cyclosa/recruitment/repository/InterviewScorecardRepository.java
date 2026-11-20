package com.cyclosa.recruitment.repository;

import com.cyclosa.recruitment.entity.InterviewScorecard;
import com.cyclosa.recruitment.enums.ScorecardStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface InterviewScorecardRepository extends JpaRepository<InterviewScorecard, UUID> {

    List<InterviewScorecard> findByInterview_Id(UUID interviewId);

    Optional<InterviewScorecard> findByInterview_IdAndInterviewerEmployeeId(UUID interviewId, UUID interviewerId);

    long countByInterview_IdAndStatus(UUID interviewId, ScorecardStatus status);

    long countByInterview_Id(UUID interviewId);
}
