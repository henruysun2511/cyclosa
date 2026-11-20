package com.cyclosa.leave.repository;

import com.cyclosa.leave.entity.LeaveRequest;
import com.cyclosa.leave.enums.LeaveRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, UUID>, JpaSpecificationExecutor<LeaveRequest> {

    @Query("SELECT lr FROM LeaveRequest lr JOIN FETCH lr.leaveType WHERE lr.id = :id")
    Optional<LeaveRequest> findByIdWithLeaveType(@Param("id") UUID id);

    Optional<LeaveRequest> findByWorkflowRequestId(UUID workflowRequestId);

    boolean existsByLeaveTypeId(UUID leaveTypeId);

    @Query("SELECT COALESCE(SUM(lr.daysCount), 0) FROM LeaveRequest lr " +
            "WHERE lr.employeeId = :employeeId " +
            "AND lr.leaveType.id = :leaveTypeId " +
            "AND lr.startDate >= :yearStart AND lr.startDate <= :yearEnd " +
            "AND lr.status = :status")
    BigDecimal sumDaysByEmployeeAndLeaveTypeAndYearAndStatus(
            @Param("employeeId") UUID employeeId,
            @Param("leaveTypeId") UUID leaveTypeId,
            @Param("yearStart") LocalDate yearStart,
            @Param("yearEnd") LocalDate yearEnd,
            @Param("status") LeaveRequestStatus status);

    @Query("SELECT lr FROM LeaveRequest lr " +
            "WHERE lr.employeeId = :employeeId " +
            "AND lr.status IN :statuses " +
            "AND lr.startDate <= :endDate AND lr.endDate >= :startDate")
    List<LeaveRequest> findOverlappingRequests(
            @Param("employeeId") UUID employeeId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("statuses") Collection<LeaveRequestStatus> statuses);

    @Query("SELECT lr FROM LeaveRequest lr JOIN FETCH lr.leaveType " +
            "WHERE lr.employeeId = :employeeId " +
            "AND lr.startDate >= :yearStart AND lr.startDate <= :yearEnd " +
            "ORDER BY lr.startDate DESC")
    List<LeaveRequest> findByEmployeeIdAndYear(
            @Param("employeeId") UUID employeeId,
            @Param("yearStart") LocalDate yearStart,
            @Param("yearEnd") LocalDate yearEnd);

    @Query("SELECT lr FROM LeaveRequest lr JOIN FETCH lr.leaveType " +
            "WHERE lr.companyId = :companyId " +
            "AND lr.employeeId IN :employeeIds " +
            "AND lr.status IN :statuses " +
            "AND lr.startDate <= :endDate AND lr.endDate >= :startDate " +
            "ORDER BY lr.startDate ASC")
    List<LeaveRequest> findCalendarRequests(
            @Param("companyId") UUID companyId,
            @Param("employeeIds") Collection<UUID> employeeIds,
            @Param("statuses") Collection<LeaveRequestStatus> statuses,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);
}

