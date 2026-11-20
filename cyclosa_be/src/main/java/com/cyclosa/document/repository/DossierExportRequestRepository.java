package com.cyclosa.document.repository;

import com.cyclosa.document.entity.DossierExportRequest;
import com.cyclosa.document.enums.ExportStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DossierExportRequestRepository extends JpaRepository<DossierExportRequest, UUID>, JpaSpecificationExecutor<DossierExportRequest> {
    Optional<DossierExportRequest> findByIdAndCompanyId(UUID id, UUID companyId);
    List<DossierExportRequest> findAllByEmployeeIdOrderByCreatedAtDesc(UUID employeeId);
    List<DossierExportRequest> findAllByStatus(ExportStatus status);
}
