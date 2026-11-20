package com.cyclosa.payroll.repository;

import com.cyclosa.payroll.entity.SalaryAdvance;
import com.cyclosa.payroll.enums.SalaryAdvanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SalaryAdvanceRepository extends JpaRepository<SalaryAdvance, UUID>, JpaSpecificationExecutor<SalaryAdvance> {

    List<SalaryAdvance> findAllByEmployeeIdOrderByRequestedAtDesc(UUID employeeId);

    List<SalaryAdvance> findAllByEmployeeIdAndStatus(UUID employeeId, SalaryAdvanceStatus status);

    List<SalaryAdvance> findAllByRecoveryPayrollPeriodIdAndStatus(UUID recoveryPayrollPeriodId, SalaryAdvanceStatus status);
}

