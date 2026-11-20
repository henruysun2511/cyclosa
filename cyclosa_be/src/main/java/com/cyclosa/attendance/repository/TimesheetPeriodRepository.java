package com.cyclosa.attendance.repository;

import com.cyclosa.attendance.entity.TimesheetPeriod;
import com.cyclosa.attendance.enums.TimesheetPeriodStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TimesheetPeriodRepository extends JpaRepository<TimesheetPeriod, UUID>, JpaSpecificationExecutor<TimesheetPeriod> {

    Optional<TimesheetPeriod> findByCompanyIdAndYearAndMonth(UUID companyId, Integer year, Integer month);

    boolean existsByCompanyIdAndYearAndMonth(UUID companyId, Integer year, Integer month);

    Optional<TimesheetPeriod> findByIdAndCompanyId(UUID id, UUID companyId);

    @Query("SELECT tp FROM TimesheetPeriod tp " +
           "WHERE tp.companyId = :companyId " +
           "AND (:year IS NULL OR tp.year = :year) " +
           "AND (:status IS NULL OR tp.status = :status) " +
           "ORDER BY tp.year DESC, tp.month DESC")
    Page<TimesheetPeriod> searchPeriods(
            @Param("companyId") UUID companyId,
            @Param("year") Integer year,
            @Param("status") TimesheetPeriodStatus status,
            Pageable pageable
    );
}

