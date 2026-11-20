package com.cyclosa.onboarding.repository;

import com.cyclosa.onboarding.entity.OnboardingTask;
import com.cyclosa.onboarding.enums.OnboardingTaskGroup;
import com.cyclosa.onboarding.enums.OnboardingTaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OnboardingTaskRepository extends JpaRepository<OnboardingTask, UUID>, JpaSpecificationExecutor<OnboardingTask> {

    List<OnboardingTask> findByProcess_IdOrderBySequenceNoAsc(UUID processId);

    List<OnboardingTask> findByProcess_IdAndStatus(UUID processId, OnboardingTaskStatus status);

    List<OnboardingTask> findByProcess_IdAndIsMandatoryTrueAndStatusNot(UUID processId, OnboardingTaskStatus status);

    List<OnboardingTask> findByOrientationSession_Id(UUID orientationSessionId);

    List<OnboardingTask> findByOrientationSession_IdAndProcess_EmployeeIdIn(UUID orientationSessionId, List<UUID> employeeIds);

    boolean existsByProcess_IdAndIsMandatoryTrueAndStatusNot(UUID processId, OnboardingTaskStatus status);
}

