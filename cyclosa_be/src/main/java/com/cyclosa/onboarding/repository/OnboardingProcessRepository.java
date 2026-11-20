package com.cyclosa.onboarding.repository;

import com.cyclosa.onboarding.entity.OnboardingProcess;
import com.cyclosa.onboarding.enums.OnboardingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface OnboardingProcessRepository extends JpaRepository<OnboardingProcess, UUID>, JpaSpecificationExecutor<OnboardingProcess> {

    Optional<OnboardingProcess> findByEmployeeIdAndStatus(UUID employeeId, OnboardingStatus status);

    Optional<OnboardingProcess> findFirstByEmployeeIdOrderByCreatedAtDesc(UUID employeeId);

    boolean existsByEmployeeIdAndStatus(UUID employeeId, OnboardingStatus status);
}

