package com.cyclosa.workplace.repository;

import com.cyclosa.workplace.entity.WorkplaceSeatRow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WorkplaceSeatRowRepository extends JpaRepository<WorkplaceSeatRow, UUID> {
    List<WorkplaceSeatRow> findByZoneId(UUID zoneId);
    Optional<WorkplaceSeatRow> findByZoneIdAndCode(UUID zoneId, String code);
    boolean existsByZoneIdAndCode(UUID zoneId, String code);
}
