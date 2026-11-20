package com.cyclosa.document.repository;

import com.cyclosa.document.entity.DocumentSourceFile;
import com.cyclosa.document.enums.OcrStatus;
import com.cyclosa.document.enums.SourceQualityStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DocumentSourceFileRepository extends JpaRepository<DocumentSourceFile, UUID>, JpaSpecificationExecutor<DocumentSourceFile> {
    Optional<DocumentSourceFile> findByIdAndCompanyId(UUID id, UUID companyId);
    List<DocumentSourceFile> findAllByOcrStatus(OcrStatus status);
    List<DocumentSourceFile> findAllByQualityStatus(SourceQualityStatus status);
}
