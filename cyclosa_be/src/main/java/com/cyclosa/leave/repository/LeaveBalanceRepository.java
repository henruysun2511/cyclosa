package com.cyclosa.leave.repository;

import com.cyclosa.leave.entity.LeaveBalance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface LeaveBalanceRepository extends JpaRepository<LeaveBalance, UUID>, JpaSpecificationExecutor<LeaveBalance> {

    @Query("SELECT lb FROM LeaveBalance lb JOIN FETCH lb.leaveType " +
            "WHERE lb.employeeId = :employeeId AND lb.year = :year")
    List<LeaveBalance> findByEmployeeIdAndYearWithLeaveType(
            @Param("employeeId") UUID employeeId, @Param("year") Integer year);

    @Query("SELECT lb FROM LeaveBalance lb JOIN FETCH lb.leaveType " +
            "WHERE lb.employeeId = :employeeId AND lb.leaveType.id = :leaveTypeId AND lb.year = :year")
    Optional<LeaveBalance> findByEmployeeIdAndLeaveTypeIdAndYear(
            @Param("employeeId") UUID employeeId,
            @Param("leaveTypeId") UUID leaveTypeId,
            @Param("year") Integer year);

    boolean existsByEmployeeIdAndLeaveTypeIdAndYear(UUID employeeId, UUID leaveTypeId, Integer year);

    boolean existsByLeaveTypeId(UUID leaveTypeId);

    List<LeaveBalance> findByCompanyIdAndYear(UUID companyId, Integer year);
}

