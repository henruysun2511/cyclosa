package com.cyclosa.recruitment.repository;

import com.cyclosa.recruitment.entity.ApplicationStageTransition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ApplicationStageTransitionRepository extends JpaRepository<ApplicationStageTransition, UUID> {

    List<ApplicationStageTransition> findByApplication_IdOrderByTransitionedAtDesc(UUID applicationId);
}
