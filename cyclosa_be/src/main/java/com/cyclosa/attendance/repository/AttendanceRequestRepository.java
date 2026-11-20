package com.cyclosa.attendance.repository;

import com.cyclosa.attendance.entity.AttendanceRequest;
import com.cyclosa.attendance.enums.AttendanceRequestStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AttendanceRequestRepository extends JpaRepository<AttendanceRequest, UUID>, JpaSpecificationExecutor<AttendanceRequest> {

    boolean existsByEmployeeIdAndWorkDateAndStatus(UUID employeeId, LocalDate workDate, AttendanceRequestStatus status);

    Optional<AttendanceRequest> findByIdAndCompanyId(UUID id, UUID companyId);

    @Query("SELECT ar FROM AttendanceRequest ar " +
           "WHERE ar.employeeId = :employeeId AND ar.workDate BETWEEN :startDate AND :endDate " +
           "AND ar.status = 'APPROVED'")
    List<AttendanceRequest> findApprovedByEmployeeAndDateRange(
            @Param("employeeId") UUID employeeId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT ar FROM AttendanceRequest ar " +
           "WHERE ar.employeeId IN :employeeIds AND ar.workDate BETWEEN :startDate AND :endDate " +
           "AND ar.status = 'APPROVED'")
    List<AttendanceRequest> findApprovedByEmployeeIdsAndDateRange(
            @Param("employeeIds") Collection<UUID> employeeIds,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT COUNT(ar) FROM AttendanceRequest ar " +
           "WHERE ar.companyId = :companyId AND ar.workDate BETWEEN :startDate AND :endDate " +
           "AND ar.status = 'PENDING'")
    long countPendingByCompanyAndDateRange(
            @Param("companyId") UUID companyId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT ar FROM AttendanceRequest ar " +
           "WHERE ar.companyId = :companyId " +
           "AND (:employeeId IS NULL OR ar.employeeId = :employeeId) " +
           "AND (:status IS NULL OR ar.status = :status) " +
           "AND (:startDate IS NULL OR ar.workDate >= :startDate) " +
           "AND (:endDate IS NULL OR ar.workDate <= :endDate)")
    Page<AttendanceRequest> searchRequests(
            @Param("companyId") UUID companyId,
            @Param("employeeId") UUID employeeId,
            @Param("status") AttendanceRequestStatus status,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            Pageable pageable
    );
}

