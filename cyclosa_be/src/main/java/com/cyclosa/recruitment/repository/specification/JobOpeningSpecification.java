package com.cyclosa.recruitment.repository.specification;

import com.cyclosa.recruitment.entity.JobOpening;
import com.cyclosa.recruitment.enums.JobOpeningStatus;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class JobOpeningSpecification {

    public static Specification<JobOpening> withFilters(
            UUID companyId,
            UUID departmentId,
            JobOpeningStatus status,
            String employmentType,
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
            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            if (keyword != null && !keyword.trim().isEmpty()) {
                String search = "%" + keyword.trim().toLowerCase() + "%";
                Predicate slugPred = cb.like(cb.lower(root.get("landingSlug")), search);
                Predicate titlePred = cb.like(cb.lower(root.get("title")), search);
                predicates.add(cb.or(slugPred, titlePred));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
