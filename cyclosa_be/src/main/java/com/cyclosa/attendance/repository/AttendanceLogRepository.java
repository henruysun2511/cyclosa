package com.cyclosa.attendance.repository;

import com.cyclosa.attendance.entity.AttendanceLog;
import com.cyclosa.attendance.enums.AttendanceEventType;
import com.cyclosa.attendance.enums.VerificationResult;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AttendanceLogRepository extends JpaRepository<AttendanceLog, UUID>, JpaSpecificationExecutor<AttendanceLog> {

    boolean existsByTransactionCode(String transactionCode);

    @Query("SELECT al FROM AttendanceLog al " +
           "WHERE al.employeeId = :employeeId AND al.occurredAt BETWEEN :from AND :to " +
           "ORDER BY al.occurredAt ASC")
    List<AttendanceLog> findByEmployeeIdAndOccurredAtBetween(
            @Param("employeeId") UUID employeeId,
            @Param("from") Instant from,
            @Param("to") Instant to
    );

    @Query("SELECT al FROM AttendanceLog al " +
           "WHERE al.employeeId IN :employeeIds AND al.occurredAt BETWEEN :from AND :to " +
           "ORDER BY al.occurredAt ASC")
    List<AttendanceLog> findByEmployeeIdsAndOccurredAtBetween(
            @Param("employeeIds") Collection<UUID> employeeIds,
            @Param("from") Instant from,
            @Param("to") Instant to
    );

    @Query("SELECT al FROM AttendanceLog al " +
           "WHERE al.employeeId = :employeeId AND al.eventType = :eventType " +
           "AND al.occurredAt BETWEEN :from AND :to " +
           "ORDER BY al.occurredAt DESC")
    List<AttendanceLog> findLatestByEmployeeAndEvent(
            @Param("employeeId") UUID employeeId,
            @Param("eventType") AttendanceEventType eventType,
            @Param("from") Instant from,
            @Param("to") Instant to
    );

    @Query("SELECT al FROM AttendanceLog al " +
           "WHERE (:employeeId IS NULL OR al.employeeId = :employeeId) " +
           "AND (:eventType IS NULL OR al.eventType = :eventType) " +
           "AND (:verificationResult IS NULL OR al.verificationResult = :verificationResult) " +
           "AND (:from IS NULL OR al.occurredAt >= :from) " +
           "AND (:to IS NULL OR al.occurredAt <= :to)")
    Page<AttendanceLog> searchLogs(
            @Param("employeeId") UUID employeeId,
            @Param("eventType") AttendanceEventType eventType,
            @Param("verificationResult") VerificationResult verificationResult,
            @Param("from") Instant from,
            @Param("to") Instant to,
            Pageable pageable
    );
}

