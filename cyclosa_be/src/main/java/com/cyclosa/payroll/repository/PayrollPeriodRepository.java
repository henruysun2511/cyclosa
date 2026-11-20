package com.cyclosa.payroll.repository;

import com.cyclosa.payroll.entity.PayrollPeriod;
import com.cyclosa.payroll.enums.PayrollPeriodStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PayrollPeriodRepository extends JpaRepository<PayrollPeriod, UUID>, JpaSpecificationExecutor<PayrollPeriod> {

    Optional<PayrollPeriod> findByCompanyIdAndCode(UUID companyId, String code);

    boolean existsByCompanyIdAndCode(UUID companyId, String code);

    boolean existsByTimesheetPeriodId(UUID timesheetPeriodId);

    List<PayrollPeriod> findAllByCompanyIdOrderByStartDateDesc(UUID companyId);

    List<PayrollPeriod> findAllByCompanyIdAndStatus(UUID companyId, PayrollPeriodStatus status);
}

