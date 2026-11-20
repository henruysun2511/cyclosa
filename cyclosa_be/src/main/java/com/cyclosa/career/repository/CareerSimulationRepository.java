package com.cyclosa.career.repository;

import com.cyclosa.career.entity.CareerSimulation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CareerSimulationRepository extends JpaRepository<CareerSimulation, UUID> {

    List<CareerSimulation> findAllByEmployeeIdOrderByCreatedAtDesc(UUID employeeId);

    @Query("SELECT cs FROM CareerSimulation cs JOIN FETCH cs.startJobTitle LEFT JOIN FETCH cs.steps s LEFT JOIN FETCH s.jobTitle WHERE cs.id = :id")
    Optional<CareerSimulation> findByIdWithDetails(@Param("id") UUID id);
}
