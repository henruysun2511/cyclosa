package com.cyclosa.workplace.repository;

import com.cyclosa.workplace.entity.WorkplaceAmenity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WorkplaceAmenityRepository extends JpaRepository<WorkplaceAmenity, UUID> {
    List<WorkplaceAmenity> findByCompanyId(UUID companyId);
    Optional<WorkplaceAmenity> findByCompanyIdAndName(UUID companyId, String name);
    boolean existsByCompanyIdAndName(UUID companyId, String name);
}
