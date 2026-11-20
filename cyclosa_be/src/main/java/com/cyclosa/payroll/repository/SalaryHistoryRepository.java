package com.cyclosa.payroll.repository;

import com.cyclosa.payroll.entity.SalaryHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SalaryHistoryRepository extends JpaRepository<SalaryHistory, UUID>, JpaSpecificationExecutor<SalaryHistory> {

    List<SalaryHistory> findAllByEmployeeIdOrderByEffectiveFromDesc(UUID employeeId);

    @Query("SELECT sh FROM SalaryHistory sh " +
           "WHERE sh.employeeId = :employeeId AND sh.effectiveFrom <= :targetDate " +
           "ORDER BY sh.effectiveFrom DESC LIMIT 1")
    Optional<SalaryHistory> findEffectiveSalaryAtDate(
            @Param("employeeId") UUID employeeId,
            @Param("targetDate") LocalDate targetDate);
}

