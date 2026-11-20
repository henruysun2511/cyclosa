package com.cyclosa.transfer.repository;

import com.cyclosa.transfer.entity.TransferAllowance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TransferAllowanceRepository extends JpaRepository<TransferAllowance, UUID> {

    List<TransferAllowance> findByTransferRequestIdAndDeletedAtIsNull(UUID transferRequestId);
}
