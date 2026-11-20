package com.cyclosa.recruitment.repository.specification;

import com.cyclosa.recruitment.entity.Candidate;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class CandidateSpecification {

    public static Specification<Candidate> withFilters(
            UUID companyId,
            Boolean isBlacklisted,
            String keyword
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (keyword != null && !keyword.trim().isEmpty()) {
                String search = "%" + keyword.trim().toLowerCase() + "%";
                Predicate namePred = cb.like(cb.lower(root.get("fullName")), search);
                Predicate emailPred = cb.like(cb.lower(root.get("email")), search);
                Predicate phonePred = cb.like(cb.lower(root.get("phone")), search);
                predicates.add(cb.or(namePred, emailPred, phonePred));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
