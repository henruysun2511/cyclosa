package com.cyclosa.onboarding.repository;

import com.cyclosa.onboarding.entity.OrientationSession;
import com.cyclosa.onboarding.enums.OrientationSessionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OrientationSessionRepository extends JpaRepository<OrientationSession, UUID>, JpaSpecificationExecutor<OrientationSession> {

    List<OrientationSession> findByCompanyId(UUID companyId);

    List<OrientationSession> findByCompanyIdAndStatus(UUID companyId, OrientationSessionStatus status);
}

