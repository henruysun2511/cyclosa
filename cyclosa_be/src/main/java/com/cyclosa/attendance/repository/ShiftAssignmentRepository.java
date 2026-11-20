package com.cyclosa.attendance.repository;

import com.cyclosa.attendance.entity.ShiftAssignment;
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
public interface ShiftAssignmentRepository extends JpaRepository<ShiftAssignment, UUID>, JpaSpecificationExecutor<ShiftAssignment> {

    Optional<ShiftAssignment> findByEmployeeIdAndWorkDate(UUID employeeId, LocalDate workDate);

    boolean existsByShiftId(UUID shiftId);

    @Query("SELECT sa FROM ShiftAssignment sa JOIN FETCH sa.shift s " +
           "WHERE sa.employeeId = :employeeId AND sa.workDate BETWEEN :startDate AND :endDate " +
           "ORDER BY sa.workDate ASC")
    List<ShiftAssignment> findByEmployeeIdAndDateRange(
            @Param("employeeId") UUID employeeId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT sa FROM ShiftAssignment sa JOIN FETCH sa.shift s " +
           "WHERE sa.employeeId IN :employeeIds AND sa.workDate BETWEEN :startDate AND :endDate " +
           "ORDER BY sa.workDate ASC")
    List<ShiftAssignment> findByEmployeeIdsAndDateRange(
            @Param("employeeIds") Collection<UUID> employeeIds,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT sa FROM ShiftAssignment sa JOIN FETCH sa.shift s " +
           "WHERE (:employeeId IS NULL OR sa.employeeId = :employeeId) " +
           "AND (:startDate IS NULL OR sa.workDate >= :startDate) " +
           "AND (:endDate IS NULL OR sa.workDate <= :endDate)")
    Page<ShiftAssignment> searchAssignments(
            @Param("employeeId") UUID employeeId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            Pageable pageable
    );
}

