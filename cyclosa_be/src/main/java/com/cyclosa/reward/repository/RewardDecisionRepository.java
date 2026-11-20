package com.cyclosa.reward.repository;

import com.cyclosa.reward.entity.RewardDecision;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RewardDecisionRepository extends JpaRepository<RewardDecision, UUID>, JpaSpecificationExecutor<RewardDecision> {

    List<RewardDecision> findAllByEmployeeIdOrderByDecisionDateDesc(UUID employeeId);

    @Query("SELECT r FROM RewardDecision r " +
            "JOIN FETCH r.employee e " +
            "JOIN FETCH r.decidedByEmployee d " +
            "WHERE r.companyId = :companyId " +
            "ORDER BY r.decisionDate DESC")
    Page<RewardDecision> findAllWithDetails(@Param("companyId") UUID companyId, Pageable pageable);
}
