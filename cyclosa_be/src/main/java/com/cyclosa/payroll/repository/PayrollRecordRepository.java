package com.cyclosa.payroll.repository;

import com.cyclosa.payroll.entity.PayrollRecord;
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
public interface PayrollRecordRepository extends JpaRepository<PayrollRecord, UUID>, JpaSpecificationExecutor<PayrollRecord> {

    Optional<PayrollRecord> findByPayrollPeriodIdAndEmployeeId(UUID payrollPeriodId, UUID employeeId);

    List<PayrollRecord> findAllByPayrollPeriodId(UUID payrollPeriodId);

    Page<PayrollRecord> findAllByPayrollPeriodId(UUID payrollPeriodId, Pageable pageable);

    @Query("SELECT pr FROM PayrollRecord pr JOIN FETCH pr.payrollPeriod pp " +
           "WHERE pr.employeeId = :employeeId AND pp.status = 'LOCKED' " +
           "ORDER BY pp.startDate DESC")
    List<PayrollRecord> findLockedRecordsByEmployeeId(@Param("employeeId") UUID employeeId);
}

