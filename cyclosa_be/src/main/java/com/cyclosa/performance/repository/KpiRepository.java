package com.cyclosa.performance.repository;

import com.cyclosa.performance.entity.Kpi;
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
public interface KpiRepository extends JpaRepository<Kpi, UUID>, JpaSpecificationExecutor<Kpi> {

    boolean existsByCompanyIdAndName(UUID companyId, String name);

    boolean existsByCompanyIdAndNameAndIdNot(UUID companyId, String name, UUID id);

    @Query("SELECT k FROM Kpi k LEFT JOIN FETCH k.department d WHERE k.companyId = :companyId ORDER BY k.name ASC")
    List<Kpi> findAllWithDepartment(@Param("companyId") UUID companyId);

    @Query("SELECT k FROM Kpi k LEFT JOIN FETCH k.department d WHERE k.companyId = :companyId")
    Page<Kpi> findAllWithDepartmentPaged(@Param("companyId") UUID companyId, Pageable pageable);

    @Query("SELECT k FROM Kpi k LEFT JOIN FETCH k.department d WHERE k.id = :id AND k.companyId = :companyId")
    Optional<Kpi> findByIdAndCompanyId(@Param("id") UUID id, @Param("companyId") UUID companyId);
}
