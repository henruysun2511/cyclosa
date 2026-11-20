package com.cyclosa.restructure.repository;

import com.cyclosa.restructure.entity.ScenarioEmployeeAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ScenarioEmployeeAssignmentRepository extends JpaRepository<ScenarioEmployeeAssignment, UUID> {

    List<ScenarioEmployeeAssignment> findByScenarioId(UUID scenarioId);

    List<ScenarioEmployeeAssignment> findByScenarioIdAndNewScenarioDeptId(UUID scenarioId, UUID newScenarioDeptId);

    Optional<ScenarioEmployeeAssignment> findByScenarioIdAndEmployeeId(UUID scenarioId, UUID employeeId);

    long countByScenarioId(UUID scenarioId);

    long countByScenarioIdAndNewScenarioDeptId(UUID scenarioId, UUID newScenarioDeptId);

    boolean existsByScenarioIdAndNewScenarioDeptId(UUID scenarioId, UUID newScenarioDeptId);
}
