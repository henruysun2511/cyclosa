package com.cyclosa.reward.repository;

import com.cyclosa.reward.entity.DisciplineCase;
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
public interface DisciplineCaseRepository extends JpaRepository<DisciplineCase, UUID>, JpaSpecificationExecutor<DisciplineCase> {

    List<DisciplineCase> findAllByEmployeeIdOrderByViolationDateDesc(UUID employeeId);

    @Query("SELECT d FROM DisciplineCase d " +
            "JOIN FETCH d.employee e " +
            "LEFT JOIN FETCH d.decidedByEmployee de " +
            "WHERE d.companyId = :companyId " +
            "ORDER BY d.violationDate DESC")
    Page<DisciplineCase> findAllWithDetails(@Param("companyId") UUID companyId, Pageable pageable);

    @Query("SELECT d FROM DisciplineCase d " +
            "JOIN FETCH d.employee e " +
            "LEFT JOIN FETCH d.decidedByEmployee de " +
            "WHERE d.id = :id")
    Optional<DisciplineCase> findByIdWithDetails(@Param("id") UUID id);
}

