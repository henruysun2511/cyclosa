package com.cyclosa.leave.repository.specification;

import com.cyclosa.leave.dto.request.LeaveRequestFilter;
import com.cyclosa.leave.entity.LeaveRequest;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

public final class LeaveRequestSpecification {

    private LeaveRequestSpecification() {}

    public static Specification<LeaveRequest> withFilter(
            UUID companyId,
            LeaveRequestFilter filter,
            Collection<UUID> allowedEmployeeIds) {
        return (root, query, cb) -> {
            if (query != null && Long.class != query.getResultType() && long.class != query.getResultType()) {
                root.fetch("leaveType", JoinType.LEFT);
            }

            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("companyId"), companyId));

            if (allowedEmployeeIds != null) {
                if (allowedEmployeeIds.isEmpty()) {
                    return cb.disjunction(); // No matching employees allowed in scope
                }
                predicates.add(root.get("employeeId").in(allowedEmployeeIds));
            }

            if (filter.getEmployeeId() != null) {
                predicates.add(cb.equal(root.get("employeeId"), filter.getEmployeeId()));
            }

            if (filter.getLeaveTypeId() != null) {
                predicates.add(cb.equal(root.get("leaveType").get("id"), filter.getLeaveTypeId()));
            }

            if (filter.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), filter.getStatus()));
            }

            if (filter.getFrom() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("endDate"), filter.getFrom()));
            }

            if (filter.getTo() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("startDate"), filter.getTo()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}

