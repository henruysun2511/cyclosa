package com.cyclosa.audit.repository.specification;

import com.cyclosa.audit.dto.request.AuditLogFilterRequest;
import com.cyclosa.audit.entity.AuditLog;
import com.cyclosa.common.util.PageableUtils;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public final class AuditLogSpecification {

    private AuditLogSpecification() {}

    public static Specification<AuditLog> filter(AuditLogFilterRequest filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filter.getActorUserId() != null) {
                predicates.add(cb.equal(root.get("actorUserId"), filter.getActorUserId()));
            }

            if (filter.getAction() != null) {
                predicates.add(cb.equal(root.get("action"), filter.getAction()));
            }

            if (filter.getEntityType() != null && !filter.getEntityType().isBlank()) {
                predicates.add(cb.equal(cb.upper(root.get("entityType")), filter.getEntityType().trim().toUpperCase()));
            }

            if (filter.getEntityId() != null && !filter.getEntityId().isBlank()) {
                predicates.add(cb.equal(root.get("entityId"), filter.getEntityId().trim()));
            }

            if (filter.getFrom() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("occurredAt"), filter.getFrom()));
            }

            if (filter.getTo() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("occurredAt"), filter.getTo()));
            }

            if (filter.getIpAddress() != null && !filter.getIpAddress().isBlank()) {
                predicates.add(cb.equal(root.get("ipAddress"), filter.getIpAddress().trim()));
            }

            String kw = PageableUtils.normalizeKeyword(filter.getKeyword());
            if (kw != null) {
                String pattern = "%" + kw.toLowerCase() + "%";
                Predicate matchDesc = cb.like(cb.lower(root.get("description")), pattern);
                Predicate matchEntityId = cb.like(cb.lower(root.get("entityId")), pattern);
                Predicate matchEntityType = cb.like(cb.lower(root.get("entityType")), pattern);
                predicates.add(cb.or(matchDesc, matchEntityId, matchEntityType));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}

