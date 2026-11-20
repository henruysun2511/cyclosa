package com.cyclosa.workplace.repository;

import com.cyclosa.workplace.entity.WorkplaceSeatAssignment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface WorkplaceSeatAssignmentRepository extends JpaRepository<WorkplaceSeatAssignment, UUID> {
    Optional<WorkplaceSeatAssignment> findBySeatIdAndReleasedAtIsNull(UUID seatId);
    Optional<WorkplaceSeatAssignment> findByEmployeeIdAndReleasedAtIsNull(UUID employeeId);
    Optional<WorkplaceSeatAssignment> findTopByEmployeeIdOrderByAssignedAtDesc(UUID employeeId);
    boolean existsBySeatIdAndReleasedAtIsNull(UUID seatId);
    boolean existsByEmployeeIdAndReleasedAtIsNull(UUID employeeId);
    Page<WorkplaceSeatAssignment> findByReleasedAtIsNull(Pageable pageable);

    @Query("SELECT a FROM WorkplaceSeatAssignment a " +
            "JOIN a.seat s " +
            "JOIN s.seatRow r " +
            "JOIN r.zone z " +
            "WHERE (:floorId IS NULL OR z.floor.id = :floorId) " +
            "AND (:employeeId IS NULL OR a.employee.id = :employeeId) " +
            "AND (:activeOnly = false OR a.releasedAt IS NULL)")
    Page<WorkplaceSeatAssignment> findAssignmentsFiltered(
            @Param("floorId") UUID floorId,
            @Param("employeeId") UUID employeeId,
            @Param("activeOnly") boolean activeOnly,
            Pageable pageable
    );
}
