package com.cyclosa.onboarding.repository;

import com.cyclosa.onboarding.entity.OnboardingTemplateItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OnboardingTemplateItemRepository extends JpaRepository<OnboardingTemplateItem, UUID> {

    List<OnboardingTemplateItem> findByTemplate_IdOrderBySequenceNoAsc(UUID templateId);

    boolean existsByItAccountTypeId(UUID itAccountTypeId);
}

