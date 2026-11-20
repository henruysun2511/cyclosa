package com.cyclosa.performance.repository;

import com.cyclosa.performance.entity.PerformanceCycle;
import com.cyclosa.performance.enums.PerformanceCycleStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PerformanceCycleRepository extends JpaRepository<PerformanceCycle, UUID>, JpaSpecificationExecutor<PerformanceCycle> {

    boolean existsByCompanyIdAndName(UUID companyId, String name);

    boolean existsByCompanyIdAndNameAndIdNot(UUID companyId, String name, UUID id);

    List<PerformanceCycle> findAllByCompanyIdOrderByStartDateDesc(UUID companyId);

    Page<PerformanceCycle> findAllByCompanyId(UUID companyId, Pageable pageable);

    Page<PerformanceCycle> findAllByCompanyIdAndStatus(UUID companyId, PerformanceCycleStatus status, Pageable pageable);

    Optional<PerformanceCycle> findByIdAndCompanyId(UUID id, UUID companyId);
}
