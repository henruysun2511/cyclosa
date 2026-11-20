package com.cyclosa.attendance.repository;

import com.cyclosa.attendance.entity.TimesheetSnapshot;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TimesheetSnapshotRepository extends JpaRepository<TimesheetSnapshot, UUID>, JpaSpecificationExecutor<TimesheetSnapshot> {

    Optional<TimesheetSnapshot> findByTimesheetPeriodIdAndEmployeeId(UUID timesheetPeriodId, UUID employeeId);

    @Query("SELECT ts FROM TimesheetSnapshot ts " +
           "LEFT JOIN FETCH ts.overtimeDetails ot " +
           "WHERE ts.timesheetPeriod.id = :periodId")
    List<TimesheetSnapshot> findByTimesheetPeriodIdWithOvertime(@Param("periodId") UUID periodId);

    @Query("SELECT ts FROM TimesheetSnapshot ts " +
           "WHERE ts.timesheetPeriod.id = :periodId " +
           "AND (:employeeId IS NULL OR ts.employeeId = :employeeId)")
    Page<TimesheetSnapshot> searchSnapshots(
            @Param("periodId") UUID periodId,
            @Param("employeeId") UUID employeeId,
            Pageable pageable
    );

    @Query("SELECT ts FROM TimesheetSnapshot ts " +
           "JOIN FETCH ts.timesheetPeriod tp " +
           "WHERE ts.employeeId = :employeeId " +
           "AND (:year IS NULL OR tp.year = :year) " +
           "ORDER BY tp.year DESC, tp.month DESC")
    List<TimesheetSnapshot> findByEmployeeIdAndYear(
            @Param("employeeId") UUID employeeId,
            @Param("year") Integer year
    );
}

