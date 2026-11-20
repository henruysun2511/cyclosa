package com.cyclosa.onboarding.repository.specification;

import com.cyclosa.onboarding.entity.ItAccountRequest;
import com.cyclosa.onboarding.enums.ItAccountRequestStatus;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class ItAccountRequestSpecification {

    public static Specification<ItAccountRequest> withFilters(
            ItAccountRequestStatus status
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}

