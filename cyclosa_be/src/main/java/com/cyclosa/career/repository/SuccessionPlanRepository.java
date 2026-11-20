package com.cyclosa.career.repository;

import com.cyclosa.career.entity.SuccessionPlan;
import com.cyclosa.career.enums.RiskLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SuccessionPlanRepository extends JpaRepository<SuccessionPlan, UUID>, JpaSpecificationExecutor<SuccessionPlan> {

    boolean existsByDepartmentIdAndJobTitleId(UUID departmentId, UUID jobTitleId);

    boolean existsByDepartmentIdAndJobTitleIdAndIdNot(UUID departmentId, UUID jobTitleId, UUID id);

    @Query("SELECT sp FROM SuccessionPlan sp JOIN FETCH sp.department JOIN FETCH sp.jobTitle LEFT JOIN FETCH sp.candidates c LEFT JOIN FETCH c.employee WHERE sp.id = :id")
    Optional<SuccessionPlan> findByIdWithDetails(@Param("id") UUID id);

    long countByCompanyId(UUID companyId);

    long countByCompanyIdAndRiskLevelIn(UUID companyId, java.util.Collection<RiskLevel> riskLevels);
}
