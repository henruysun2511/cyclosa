package com.cyclosa.career.repository;

import com.cyclosa.career.entity.SuccessionCandidate;
import com.cyclosa.career.enums.Readiness;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SuccessionCandidateRepository extends JpaRepository<SuccessionCandidate, UUID>, JpaSpecificationExecutor<SuccessionCandidate> {

    Optional<SuccessionCandidate> findBySuccessionPlanIdAndEmployeeId(UUID successionPlanId, UUID employeeId);

    boolean existsBySuccessionPlanIdAndEmployeeId(UUID successionPlanId, UUID employeeId);

    @Query("SELECT sc FROM SuccessionCandidate sc JOIN FETCH sc.employee e WHERE sc.successionPlan.id = :planId")
    List<SuccessionCandidate> findAllByPlanIdWithEmployee(@Param("planId") UUID planId);

    @Query("SELECT COUNT(sc) FROM SuccessionCandidate sc WHERE sc.successionPlan.companyId = :companyId AND sc.readiness = :readiness")
    long countByCompanyIdAndReadiness(@Param("companyId") UUID companyId, @Param("readiness") Readiness readiness);
}
