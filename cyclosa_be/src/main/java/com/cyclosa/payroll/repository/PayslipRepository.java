package com.cyclosa.payroll.repository;

import com.cyclosa.payroll.entity.Payslip;
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
public interface PayslipRepository extends JpaRepository<Payslip, UUID>, JpaSpecificationExecutor<Payslip> {

    Optional<Payslip> findByPayrollRecordId(UUID payrollRecordId);

    Page<Payslip> findAllByEmployeeIdOrderByIssuedAtDesc(UUID employeeId, Pageable pageable);

    @Query("SELECT ps FROM Payslip ps JOIN ps.payrollRecord pr " +
           "WHERE pr.payrollPeriod.id = :payrollPeriodId")
    List<Payslip> findAllByPayrollPeriodId(@Param("payrollPeriodId") UUID payrollPeriodId);
}

