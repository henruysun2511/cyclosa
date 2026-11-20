package com.cyclosa.recruitment.repository.specification;

import com.cyclosa.recruitment.entity.Interview;
import com.cyclosa.recruitment.enums.InterviewFormat;
import com.cyclosa.recruitment.enums.InterviewStatus;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class InterviewSpecification {

    public static Specification<Interview> withFilters(
            UUID companyId,
            UUID roundId,
            UUID applicationId,
            InterviewStatus status,
            InterviewFormat format,
            LocalDateTime fromDate,
            LocalDateTime toDate,
            String keyword
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (roundId != null) {
                predicates.add(cb.equal(root.get("interviewRound").get("id"), roundId));
            }
            if (applicationId != null) {
                predicates.add(cb.equal(root.get("application").get("id"), applicationId));
            }
            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            if (format != null) {
                predicates.add(cb.equal(root.get("format"), format));
            }
            if (fromDate != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("scheduledStart"), fromDate));
            }
            if (toDate != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("scheduledEnd"), toDate));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
