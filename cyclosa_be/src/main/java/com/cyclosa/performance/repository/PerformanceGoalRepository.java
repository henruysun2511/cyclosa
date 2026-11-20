package com.cyclosa.performance.repository;

import com.cyclosa.performance.entity.PerformanceGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Repository
public interface PerformanceGoalRepository extends JpaRepository<PerformanceGoal, UUID> {

    @Query("SELECT g FROM PerformanceGoal g LEFT JOIN FETCH g.kpi k WHERE g.review.id = :reviewId ORDER BY g.createdAt ASC")
    List<PerformanceGoal> findAllByReviewIdWithKpi(@Param("reviewId") UUID reviewId);

    @Query("SELECT COALESCE(SUM(g.weight), 0) FROM PerformanceGoal g WHERE g.review.id = :reviewId")
    BigDecimal sumWeightByReviewId(@Param("reviewId") UUID reviewId);

    @Query("SELECT COALESCE(SUM(g.weight), 0) FROM PerformanceGoal g WHERE g.review.id = :reviewId AND g.id != :excludeGoalId")
    BigDecimal sumWeightByReviewIdExcluding(@Param("reviewId") UUID reviewId, @Param("excludeGoalId") UUID excludeGoalId);

    boolean existsByKpiId(UUID kpiId);
}
