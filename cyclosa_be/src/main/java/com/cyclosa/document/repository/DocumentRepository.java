package com.cyclosa.document.repository;

import com.cyclosa.document.entity.Document;
import com.cyclosa.document.enums.DocumentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DocumentRepository extends JpaRepository<Document, UUID>, JpaSpecificationExecutor<Document> {
    Optional<Document> findByIdAndCompanyId(UUID id, UUID companyId);
    boolean existsByCompanyIdAndDocumentCode(UUID companyId, String documentCode);
    boolean existsByDocumentTypeId(UUID documentTypeId);

    List<Document> findAllByEmployeeId(UUID employeeId);
    List<Document> findAllByDossierId(UUID dossierId);

    // Tìm tài liệu đủ điều kiện tiêu hủy (ARCHIVED, hết hạn lưu trữ <= date, không bị LEGAL HOLD)
    @Query("SELECT d FROM Document d WHERE d.companyId = :companyId " +
           "AND d.status = :status " +
           "AND d.isLegalHold = false " +
           "AND d.retentionUntil IS NOT NULL " +
           "AND d.retentionUntil <= :currentDate")
    List<Document> findDestructionCandidates(
            @Param("companyId") UUID companyId,
            @Param("status") DocumentStatus status,
            @Param("currentDate") LocalDate currentDate);
}
