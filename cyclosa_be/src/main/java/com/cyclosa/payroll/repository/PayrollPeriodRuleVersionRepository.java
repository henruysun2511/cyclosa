package com.cyclosa.payroll.repository;

import com.cyclosa.payroll.entity.PayrollPeriodRuleVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PayrollPeriodRuleVersionRepository extends JpaRepository<PayrollPeriodRuleVersion, PayrollPeriodRuleVersion.PayrollPeriodRuleVersionId> {

    List<PayrollPeriodRuleVersion> findAllByPayrollPeriodId(UUID payrollPeriodId);
}

