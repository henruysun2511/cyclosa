package com.cyclosa.onboarding.repository;

import com.cyclosa.onboarding.entity.OnboardingChecklistTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OnboardingChecklistTemplateRepository extends JpaRepository<OnboardingChecklistTemplate, UUID>, JpaSpecificationExecutor<OnboardingChecklistTemplate> {

    List<OnboardingChecklistTemplate> findByCompanyIdAndIsActiveTrue(UUID companyId);

    Optional<OnboardingChecklistTemplate> findFirstByCompanyIdAndDepartmentIdAndJobTitleIdAndIsActiveTrue(
            UUID companyId, UUID departmentId, UUID jobTitleId);

    Optional<OnboardingChecklistTemplate> findFirstByCompanyIdAndDepartmentIdAndJobTitleIdIsNullAndIsActiveTrue(
            UUID companyId, UUID departmentId);

    Optional<OnboardingChecklistTemplate> findFirstByCompanyIdAndDepartmentIdIsNullAndJobTitleIdIsNullAndIsActiveTrue(
            UUID companyId);
}

