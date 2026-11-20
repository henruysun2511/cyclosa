package com.cyclosa.recruitment.repository;

import com.cyclosa.recruitment.entity.InterviewPanelist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface InterviewPanelistRepository extends JpaRepository<InterviewPanelist, UUID> {

    List<InterviewPanelist> findByInterview_Id(UUID interviewId);

    List<InterviewPanelist> findByEmployeeId(UUID employeeId);

    Optional<InterviewPanelist> findByInterview_IdAndEmployeeId(UUID interviewId, UUID employeeId);

    void deleteByInterview_Id(UUID interviewId);
}
