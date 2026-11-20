package com.cyclosa.workplace.repository;

import com.cyclosa.workplace.entity.WorkplaceFloorPlan;
import com.cyclosa.workplace.enums.FloorPlanStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WorkplaceFloorPlanRepository extends JpaRepository<WorkplaceFloorPlan, UUID> {
    List<WorkplaceFloorPlan> findByFloorIdOrderByVersionNoDesc(UUID floorId);
    Optional<WorkplaceFloorPlan> findByFloorIdAndStatus(UUID floorId, FloorPlanStatus status);
    Optional<WorkplaceFloorPlan> findTopByFloorIdAndStatusOrderByVersionNoDesc(UUID floorId, FloorPlanStatus status);
    Optional<WorkplaceFloorPlan> findTopByFloorIdOrderByVersionNoDesc(UUID floorId);
}
