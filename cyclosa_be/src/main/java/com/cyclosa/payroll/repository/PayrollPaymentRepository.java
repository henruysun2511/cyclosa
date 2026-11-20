package com.cyclosa.payroll.repository;

import com.cyclosa.payroll.entity.PayrollPayment;
import com.cyclosa.payroll.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PayrollPaymentRepository extends JpaRepository<PayrollPayment, UUID>, JpaSpecificationExecutor<PayrollPayment> {

    List<PayrollPayment> findAllByPayrollRecordId(UUID payrollRecordId);

    @Query("SELECT pp FROM PayrollPayment pp JOIN pp.payrollRecord pr " +
           "WHERE pr.payrollPeriod.id = :payrollPeriodId")
    List<PayrollPayment> findAllByPayrollPeriodId(@Param("payrollPeriodId") UUID payrollPeriodId);

    @Query("SELECT COUNT(pp) FROM PayrollPayment pp JOIN pp.payrollRecord pr " +
           "WHERE pr.payrollPeriod.id = :payrollPeriodId AND pp.status = :status")
    long countByPayrollPeriodIdAndStatus(@Param("payrollPeriodId") UUID payrollPeriodId, @Param("status") PaymentStatus status);
}

