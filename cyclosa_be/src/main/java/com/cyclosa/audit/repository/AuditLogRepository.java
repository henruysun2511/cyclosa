package com.cyclosa.audit.repository;

import com.cyclosa.audit.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, UUID>, JpaSpecificationExecutor<AuditLog> {

    /**
     * Lấy toàn bộ dòng thời gian truy vết của một thực thể cụ thể (sắp xếp tăng dần theo thời gian).
     */
    List<AuditLog> findByEntityTypeIgnoreCaseAndEntityIdOrderByOccurredAtAsc(String entityType, String entityId);
}

