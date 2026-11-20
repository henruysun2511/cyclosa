package com.cyclosa.restructure.repository;

import com.cyclosa.restructure.entity.ScenarioDepartment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ScenarioDepartmentRepository extends JpaRepository<ScenarioDepartment, UUID>, JpaSpecificationExecutor<ScenarioDepartment> {

    List<ScenarioDepartment> findByScenarioId(UUID scenarioId);

    Optional<ScenarioDepartment> findByIdAndScenarioId(UUID id, UUID scenarioId);

    List<ScenarioDepartment> findByScenarioIdAndParentScenarioDeptIsNull(UUID scenarioId);

    List<ScenarioDepartment> findByScenarioIdAndParentScenarioDeptId(UUID scenarioId, UUID parentScenarioDeptId);

    boolean existsByScenarioIdAndParentScenarioDeptId(UUID scenarioId, UUID parentScenarioDeptId);
}
