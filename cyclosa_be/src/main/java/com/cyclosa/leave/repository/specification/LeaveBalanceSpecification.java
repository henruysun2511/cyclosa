package com.cyclosa.leave.repository.specification;

import com.cyclosa.leave.dto.request.LeaveBalanceFilter;
import com.cyclosa.leave.entity.LeaveBalance;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

public final class LeaveBalanceSpecification {

    private LeaveBalanceSpecification() {}

    public static Specification<LeaveBalance> withFilter(
            UUID companyId,
            LeaveBalanceFilter filter,
            Collection<UUID> allowedEmployeeIds) {
        return (root, query, cb) -> {
            if (query != null && Long.class != query.getResultType() && long.class != query.getResultType()) {
                root.fetch("leaveType", JoinType.LEFT);
            }

            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("companyId"), companyId));

            if (filter.getYear() != null) {
                predicates.add(cb.equal(root.get("year"), filter.getYear()));
            }

            if (filter.getLeaveTypeId() != null) {
                predicates.add(cb.equal(root.get("leaveType").get("id"), filter.getLeaveTypeId()));
            }

            if (filter.getEmployeeId() != null) {
                predicates.add(cb.equal(root.get("employeeId"), filter.getEmployeeId()));
            }

            if (allowedEmployeeIds != null) {
                if (allowedEmployeeIds.isEmpty()) {
                    return cb.disjunction();
                }
                predicates.add(root.get("employeeId").in(allowedEmployeeIds));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}

