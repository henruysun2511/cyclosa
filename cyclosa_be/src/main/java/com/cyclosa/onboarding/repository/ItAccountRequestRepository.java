package com.cyclosa.onboarding.repository;

import com.cyclosa.onboarding.entity.ItAccountRequest;
import com.cyclosa.onboarding.enums.ItAccountRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ItAccountRequestRepository extends JpaRepository<ItAccountRequest, UUID>, JpaSpecificationExecutor<ItAccountRequest> {

    List<ItAccountRequest> findByStatus(ItAccountRequestStatus status);

    Optional<ItAccountRequest> findByOnboardingTask_Id(UUID onboardingTaskId);
}

