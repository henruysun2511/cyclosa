package com.cyclosa.workplace.repository;

import com.cyclosa.workplace.entity.WorkplaceFloorObject;
import com.cyclosa.workplace.enums.FloorObjectType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WorkplaceFloorObjectRepository extends JpaRepository<WorkplaceFloorObject, UUID> {
    List<WorkplaceFloorObject> findByFloorId(UUID floorId);
    List<WorkplaceFloorObject> findByFloorIdAndObjectType(UUID floorId, FloorObjectType objectType);
    Optional<WorkplaceFloorObject> findByQrToken(String qrToken);
}
