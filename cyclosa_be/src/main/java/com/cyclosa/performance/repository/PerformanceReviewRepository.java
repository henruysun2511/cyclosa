package com.cyclosa.performance.repository;

import com.cyclosa.performance.entity.PerformanceReview;
import com.cyclosa.performance.enums.ReviewStatus;
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
public interface PerformanceReviewRepository extends JpaRepository<PerformanceReview, UUID>, JpaSpecificationExecutor<PerformanceReview> {

    boolean existsByCycleIdAndEmployeeId(UUID cycleId, UUID employeeId);

    @Query("SELECT r FROM PerformanceReview r " +
            "JOIN FETCH r.cycle c " +
            "JOIN FETCH r.employee e " +
            "LEFT JOIN FETCH r.managerEmployee m " +
            "WHERE r.id = :id")
    Optional<PerformanceReview> findByIdWithDetails(@Param("id") UUID id);

    @Query("SELECT r FROM PerformanceReview r " +
            "JOIN FETCH r.cycle c " +
            "JOIN FETCH r.employee e " +
            "LEFT JOIN FETCH r.managerEmployee m " +
            "WHERE r.cycle.id = :cycleId")
    List<PerformanceReview> findAllByCycleIdWithDetails(@Param("cycleId") UUID cycleId);

    @Query("SELECT r FROM PerformanceReview r " +
            "JOIN FETCH r.cycle c " +
            "JOIN FETCH r.employee e " +
            "LEFT JOIN FETCH r.managerEmployee m " +
            "WHERE r.employee.id = :employeeId " +
            "ORDER BY c.startDate DESC")
    List<PerformanceReview> findAllByEmployeeIdWithDetails(@Param("employeeId") UUID employeeId);

    long countByCycleId(UUID cycleId);

    long countByCycleIdAndStatus(UUID cycleId, ReviewStatus status);
}
