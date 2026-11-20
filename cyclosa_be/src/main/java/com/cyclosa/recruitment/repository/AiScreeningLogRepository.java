package com.cyclosa.recruitment.repository;

import com.cyclosa.recruitment.entity.AiScreeningLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AiScreeningLogRepository extends JpaRepository<AiScreeningLog, UUID> {

    List<AiScreeningLog> findByApplicationIdOrderByCreatedAtDesc(UUID applicationId);

    Optional<AiScreeningLog> findFirstByApplicationIdOrderByCreatedAtDesc(UUID applicationId);
}
