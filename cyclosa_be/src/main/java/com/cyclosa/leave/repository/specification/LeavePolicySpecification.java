package com.cyclosa.leave.repository.specification;

import com.cyclosa.leave.dto.request.LeavePolicyFilter;
import com.cyclosa.leave.entity.LeavePolicy;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public final class LeavePolicySpecification {

    private LeavePolicySpecification() {}

    public static Specification<LeavePolicy> withFilter(UUID companyId, LeavePolicyFilter filter) {
        return (root, query, cb) -> {
            // Eager fetch leaveType
            if (query != null && Long.class != query.getResultType() && long.class != query.getResultType()) {
                root.fetch("leaveType", JoinType.LEFT);
            }

            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("companyId"), companyId));

            if (filter.getLeaveTypeId() != null) {
                predicates.add(cb.equal(root.get("leaveType").get("id"), filter.getLeaveTypeId()));
            }

            if (filter.getContractType() != null) {
                predicates.add(cb.equal(root.get("contractType"), filter.getContractType()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}

