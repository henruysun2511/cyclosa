package com.cyclosa.document.repository;

import com.cyclosa.document.entity.Dossier;
import com.cyclosa.document.enums.DossierPurpose;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DossierRepository extends JpaRepository<Dossier, UUID>, JpaSpecificationExecutor<Dossier> {
    List<Dossier> findAllByEmployeeId(UUID employeeId);
    Optional<Dossier> findByIdAndCompanyId(UUID id, UUID companyId);
    Optional<Dossier> findByEmployeeIdAndPurpose(UUID employeeId, DossierPurpose purpose);
    boolean existsByCompanyIdAndDossierCode(UUID companyId, String dossierCode);
}
