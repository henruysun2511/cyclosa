package com.cyclosa.recruitment.repository;

import com.cyclosa.recruitment.entity.Application;
import com.cyclosa.recruitment.enums.ApplicationStage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, UUID>, JpaSpecificationExecutor<Application> {

    List<Application> findByJobOpening_Id(UUID jobOpeningId);

    List<Application> findByCandidate_Id(UUID candidateId);

    boolean existsByJobOpening_IdAndCandidate_Id(UUID jobOpeningId, UUID candidateId);

    long countByJobOpening_IdAndCurrentStage(UUID jobOpeningId, ApplicationStage currentStage);

    long countByJobOpening_Id(UUID jobOpeningId);
}
