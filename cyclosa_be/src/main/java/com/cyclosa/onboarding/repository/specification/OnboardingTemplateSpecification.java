package com.cyclosa.onboarding.repository.specification;

import com.cyclosa.onboarding.entity.OnboardingChecklistTemplate;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class OnboardingTemplateSpecification {

    public static Specification<OnboardingChecklistTemplate> withFilters(
            UUID companyId,
            UUID departmentId,
            UUID jobTitleId,
            Boolean isActive,
            String keyword
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (companyId != null) {
                predicates.add(cb.equal(root.get("companyId"), companyId));
            }
            if (departmentId != null) {
                predicates.add(cb.equal(root.get("departmentId"), departmentId));
            }
            if (jobTitleId != null) {
                predicates.add(cb.equal(root.get("jobTitleId"), jobTitleId));
            }
            if (isActive != null) {
                predicates.add(cb.equal(root.get("isActive"), isActive));
            }
            if (keyword != null && !keyword.trim().isEmpty()) {
                String search = "%" + keyword.trim().toLowerCase() + "%";
                predicates.add(cb.like(cb.lower(root.get("name")), search));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}

