package com.cyclosa.recruitment.repository.specification;

import com.cyclosa.recruitment.entity.Application;
import com.cyclosa.recruitment.enums.ApplicationStage;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class ApplicationSpecification {

    public static Specification<Application> withFilters(
            UUID companyId,
            UUID jobOpeningId,
            UUID candidateId,
            ApplicationStage currentStage,
            Boolean isRejected,
            Boolean isWithdrawn,
            BigDecimal minAiScore,
            String keyword
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (jobOpeningId != null) {
                predicates.add(cb.equal(root.get("jobOpening").get("id"), jobOpeningId));
            }
            if (candidateId != null) {
                predicates.add(cb.equal(root.get("candidate").get("id"), candidateId));
            }
            if (currentStage != null) {
                predicates.add(cb.equal(root.get("currentStage"), currentStage));
            }
            if (Boolean.TRUE.equals(isRejected)) {
                predicates.add(cb.isNotNull(root.get("rejectionReason")));
            }
            if (minAiScore != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("aiMatchScore"), minAiScore));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
