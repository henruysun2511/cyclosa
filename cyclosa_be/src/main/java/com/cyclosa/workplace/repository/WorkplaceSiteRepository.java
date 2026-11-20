package com.cyclosa.workplace.repository;

import com.cyclosa.workplace.entity.WorkplaceSite;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface WorkplaceSiteRepository extends JpaRepository<WorkplaceSite, UUID> {
    Optional<WorkplaceSite> findByCode(String code);
    boolean existsByCode(String code);
    Page<WorkplaceSite> findByBranchId(UUID branchId, Pageable pageable);
}
