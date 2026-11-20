package com.cyclosa.recruitment.repository.specification;

import com.cyclosa.recruitment.entity.RecruitmentRequest;
import com.cyclosa.recruitment.enums.RecruitmentRequestStatus;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class RecruitmentRequestSpecification {

    public static Specification<RecruitmentRequest> withFilters(
            UUID companyId,
            UUID departmentId,
            UUID positionId,
            RecruitmentRequestStatus status,
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
            if (positionId != null) {
                predicates.add(cb.equal(root.get("jobTitleId"), positionId));
            }
            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            if (keyword != null && !keyword.trim().isEmpty()) {
                String search = "%" + keyword.trim().toLowerCase() + "%";
                predicates.add(cb.like(cb.lower(root.get("justification")), search));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
