package com.cyclosa.leave.repository.specification;

import com.cyclosa.leave.dto.request.LeaveTypeFilter;
import com.cyclosa.leave.entity.LeaveType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public final class LeaveTypeSpecification {

    private LeaveTypeSpecification() {}

    public static Specification<LeaveType> withFilter(UUID companyId, LeaveTypeFilter filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.equal(root.get("companyId"), companyId));

            if (filter.getLeaveGroup() != null) {
                predicates.add(cb.equal(root.get("leaveGroup"), filter.getLeaveGroup()));
            }

            if (filter.getIsActive() != null) {
                predicates.add(cb.equal(root.get("isActive"), filter.getIsActive()));
            }

            if (filter.getPayer() != null) {
                predicates.add(cb.equal(root.get("payer"), filter.getPayer()));
            }

            if (StringUtils.hasText(filter.getKeyword())) {
                String pattern = "%" + filter.getKeyword().trim().toLowerCase() + "%";
                Predicate nameLike = cb.like(cb.lower(root.get("name")), pattern);
                Predicate codeLike = cb.like(cb.lower(root.get("code")), pattern);
                predicates.add(cb.or(nameLike, codeLike));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}

