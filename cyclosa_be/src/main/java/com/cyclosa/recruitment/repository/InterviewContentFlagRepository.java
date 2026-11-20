package com.cyclosa.recruitment.repository;

import com.cyclosa.recruitment.entity.InterviewContentFlag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface InterviewContentFlagRepository extends JpaRepository<InterviewContentFlag, UUID> {

    List<InterviewContentFlag> findByInterview_Id(UUID interviewId);
}
