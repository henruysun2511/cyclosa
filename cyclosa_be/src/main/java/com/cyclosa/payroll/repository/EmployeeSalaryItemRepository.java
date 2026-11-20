package com.cyclosa.payroll.repository;

import com.cyclosa.payroll.entity.EmployeeSalaryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface EmployeeSalaryItemRepository extends JpaRepository<EmployeeSalaryItem, UUID>, JpaSpecificationExecutor<EmployeeSalaryItem> {

    List<EmployeeSalaryItem> findAllByEmployeeId(UUID employeeId);

    @Query("SELECT item FROM EmployeeSalaryItem item " +
           "WHERE item.employeeId = :employeeId " +
           "AND ((item.effectiveFrom IS NOT NULL AND item.effectiveFrom <= :endDate AND (item.effectiveTo IS NULL OR item.effectiveTo >= :startDate)) " +
           "OR (item.payrollPeriodId = :payrollPeriodId))")
    List<EmployeeSalaryItem> findActiveItemsForPeriod(
            @Param("employeeId") UUID employeeId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("payrollPeriodId") UUID payrollPeriodId);

    boolean existsBySalaryComponentId(UUID salaryComponentId);
}

