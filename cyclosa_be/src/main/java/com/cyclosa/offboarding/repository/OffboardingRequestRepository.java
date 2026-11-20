package com.cyclosa.offboarding.repository;

import com.cyclosa.offboarding.entity.OffboardingRequest;
import com.cyclosa.offboarding.enums.OffboardingStatus;
import com.cyclosa.offboarding.enums.OffboardingType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OffboardingRequestRepository extends JpaRepository<OffboardingRequest, UUID>, JpaSpecificationExecutor<OffboardingRequest> {

    boolean existsByEmployeeIdAndStatusIn(UUID employeeId, Collection<OffboardingStatus> statuses);

    Optional<OffboardingRequest> findByEmployeeIdAndStatusIn(UUID employeeId, Collection<OffboardingStatus> statuses);

    long countByStatus(OffboardingStatus status);

    long countByType(OffboardingType type);

    @Query("SELECT r FROM OffboardingRequest r LEFT JOIN FETCH r.employee e LEFT JOIN FETCH r.successor s LEFT JOIN FETCH r.approver a WHERE r.id = :id")
    Optional<OffboardingRequest> findByIdWithDetails(@Param("id") UUID id);

    List<OffboardingRequest> findByEmployeeIdOrderByCreatedAtDesc(UUID employeeId);
}
