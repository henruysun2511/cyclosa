package com.cyclosa.workplace.repository;

import com.cyclosa.workplace.entity.WorkplaceFloor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WorkplaceFloorRepository extends JpaRepository<WorkplaceFloor, UUID> {
    List<WorkplaceFloor> findBySiteIdOrderByFloorNumberAsc(UUID siteId);
    Optional<WorkplaceFloor> findBySiteIdAndFloorNumber(UUID siteId, Integer floorNumber);
    boolean existsBySiteIdAndFloorNumber(UUID siteId, Integer floorNumber);
}
