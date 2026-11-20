package com.cyclosa.onboarding.repository.specification;

import com.cyclosa.onboarding.entity.OrientationSession;
import com.cyclosa.onboarding.enums.OrientationSessionStatus;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class OrientationSessionSpecification {

    public static Specification<OrientationSession> withFilters(
            UUID companyId,
            OrientationSessionStatus status,
            LocalDateTime from,
            LocalDateTime to,
            String keyword
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (companyId != null) {
                predicates.add(cb.equal(root.get("companyId"), companyId));
            }
            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            if (from != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("startTime"), from));
            }
            if (to != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("endTime"), to));
            }
            if (keyword != null && !keyword.trim().isEmpty()) {
                String search = "%" + keyword.trim().toLowerCase() + "%";
                Predicate titlePred = cb.like(cb.lower(root.get("title")), search);
                Predicate locPred = cb.like(cb.lower(root.get("location")), search);
                predicates.add(cb.or(titlePred, locPred));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}

