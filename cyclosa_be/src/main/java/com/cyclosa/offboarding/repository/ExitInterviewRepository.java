package com.cyclosa.offboarding.repository;

import com.cyclosa.offboarding.entity.ExitInterview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ExitInterviewRepository extends JpaRepository<ExitInterview, UUID> {

    Optional<ExitInterview> findByOffboardingRequestId(UUID offboardingRequestId);

    @Query("SELECT e FROM ExitInterview e LEFT JOIN FETCH e.interviewer WHERE e.offboardingRequest.id = :requestId")
    Optional<ExitInterview> findByOffboardingRequestIdWithInterviewer(@Param("requestId") UUID requestId);
}
