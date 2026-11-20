package com.cyclosa.offboarding.repository;

import com.cyclosa.offboarding.entity.OffboardingClearanceItem;
import com.cyclosa.offboarding.enums.ClearanceStatus;
import com.cyclosa.offboarding.enums.ClearanceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OffboardingClearanceItemRepository extends JpaRepository<OffboardingClearanceItem, UUID> {

    List<OffboardingClearanceItem> findByOffboardingRequestIdOrderByCreatedAtAsc(UUID offboardingRequestId);

    Optional<OffboardingClearanceItem> findByOffboardingRequestIdAndClearanceType(UUID offboardingRequestId, ClearanceType clearanceType);

    long countByOffboardingRequestIdAndStatus(UUID offboardingRequestId, ClearanceStatus status);

    @Query("SELECT c FROM OffboardingClearanceItem c LEFT JOIN FETCH c.clearedBy WHERE c.offboardingRequest.id = :requestId ORDER BY c.createdAt ASC")
    List<OffboardingClearanceItem> findByOffboardingRequestIdWithClearedBy(@Param("requestId") UUID requestId);
}
