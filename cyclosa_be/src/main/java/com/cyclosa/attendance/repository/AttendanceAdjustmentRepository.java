package com.cyclosa.attendance.repository;

import com.cyclosa.attendance.entity.AttendanceAdjustment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AttendanceAdjustmentRepository extends JpaRepository<AttendanceAdjustment, UUID>, JpaSpecificationExecutor<AttendanceAdjustment> {

    Optional<AttendanceAdjustment> findByAttendanceRequestId(UUID attendanceRequestId);

    @Query("SELECT adj FROM AttendanceAdjustment adj JOIN FETCH adj.attendanceRequest req " +
           "WHERE adj.companyId = :companyId " +
           "AND (:employeeId IS NULL OR adj.employeeId = :employeeId) " +
           "ORDER BY adj.createdAt DESC")
    Page<AttendanceAdjustment> searchAdjustments(
            @Param("companyId") UUID companyId,
            @Param("employeeId") UUID employeeId,
            Pageable pageable
    );
}

