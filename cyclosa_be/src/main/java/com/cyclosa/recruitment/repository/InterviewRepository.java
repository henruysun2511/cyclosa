package com.cyclosa.recruitment.repository;

import com.cyclosa.recruitment.entity.Interview;
import com.cyclosa.recruitment.enums.InterviewStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, UUID>, JpaSpecificationExecutor<Interview> {

    List<Interview> findByApplication_Id(UUID applicationId);

    List<Interview> findByInterviewRound_Id(UUID roundId);

    List<Interview> findByStatus(InterviewStatus status);

    List<Interview> findByScheduledStartBetween(LocalDateTime from, LocalDateTime to);
}
