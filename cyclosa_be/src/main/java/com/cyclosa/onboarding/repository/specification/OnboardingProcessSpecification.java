package com.cyclosa.onboarding.repository.specification;

import com.cyclosa.onboarding.entity.OnboardingProcess;
import com.cyclosa.onboarding.enums.OnboardingStatus;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class OnboardingProcessSpecification {

    public static Specification<OnboardingProcess> withFilters(
            OnboardingStatus status,
            UUID employeeId
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            if (employeeId != null) {
                predicates.add(cb.equal(root.get("employeeId"), employeeId));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}

