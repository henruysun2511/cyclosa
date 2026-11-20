package com.cyclosa.workplace.repository;

import com.cyclosa.workplace.entity.WorkplaceZone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface WorkplaceZoneRepository extends JpaRepository<WorkplaceZone, UUID> {
    List<WorkplaceZone> findByFloorId(UUID floorId);
    boolean existsByFloorId(UUID floorId);
}
