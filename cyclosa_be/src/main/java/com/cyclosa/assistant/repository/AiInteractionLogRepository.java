package com.cyclosa.assistant.repository;

import com.cyclosa.assistant.entity.AiInteractionLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AiInteractionLogRepository extends JpaRepository<AiInteractionLog, UUID> {

    long countByCompanyId(UUID companyId);

    @Query("SELECT COALESCE(SUM(l.totalTokens), 0) FROM AiInteractionLog l WHERE l.companyId = :companyId")
    Long sumTotalTokensByCompanyId(@Param("companyId") UUID companyId);

    @Query("SELECT l.feature, COUNT(l) FROM AiInteractionLog l WHERE l.companyId = :companyId GROUP BY l.feature")
    List<Object[]> countByFeatureGrouped(@Param("companyId") UUID companyId);
}
