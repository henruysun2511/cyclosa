package com.cyclosa.restructure.repository;

import com.cyclosa.restructure.entity.ScenarioAction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ScenarioActionRepository extends JpaRepository<ScenarioAction, UUID> {

    List<ScenarioAction> findByScenarioIdOrderByCreatedAtDesc(UUID scenarioId);
}
