package com.cyclosa.transfer.repository;

import com.cyclosa.transfer.entity.TransferRequest;
import com.cyclosa.transfer.enums.TransferStatus;
import com.cyclosa.transfer.enums.TransferType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface TransferRequestRepository extends JpaRepository<TransferRequest, UUID>, JpaSpecificationExecutor<TransferRequest> {

    @Query("SELECT COUNT(t) > 0 FROM TransferRequest t " +
            "WHERE t.employee.id = :employeeId " +
            "AND t.status IN ('SUBMITTED', 'PENDING_APPROVAL', 'APPROVED') " +
            "AND t.deletedAt IS NULL")
    boolean existsActiveTransferForEmployee(@Param("employeeId") UUID employeeId);

    @Query("SELECT COUNT(t) > 0 FROM TransferRequest t " +
            "WHERE t.employee.id = :employeeId " +
            "AND t.id <> :excludeId " +
            "AND t.status IN ('SUBMITTED', 'PENDING_APPROVAL', 'APPROVED') " +
            "AND t.deletedAt IS NULL")
    boolean existsActiveTransferForEmployeeExcluding(@Param("employeeId") UUID employeeId, @Param("excludeId") UUID excludeId);

    long countByDeletedAtIsNull();

    long countByStatusAndDeletedAtIsNull(TransferStatus status);

    long countByTransferTypeAndDeletedAtIsNull(TransferType transferType);

    @Query("SELECT t FROM TransferRequest t " +
            "WHERE t.transferType = 'TEMPORARY_DISPATCH' " +
            "AND t.status = 'COMPLETED' " +
            "AND t.isReturned = false " +
            "AND t.endDate BETWEEN :startDate AND :endDate " +
            "AND t.deletedAt IS NULL")
    List<TransferRequest> findExpiringTemporaryTransfers(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT t FROM TransferRequest t " +
            "WHERE t.status = 'APPROVED' " +
            "AND t.effectiveDate <= :today " +
            "AND t.deletedAt IS NULL")
    List<TransferRequest> findApprovedTransfersDueForExecution(@Param("today") LocalDate today);
}
