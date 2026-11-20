package com.cyclosa.document.mapper;

import com.cyclosa.document.dto.DocumentDto;
import com.cyclosa.document.dto.DocumentVersionDto;
import com.cyclosa.document.entity.*;
import com.cyclosa.document.enums.DocumentStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class DocumentMapper {

    private final DocumentVersionMapper versionMapper;

    public Document toEntity(DocumentDto.CreateRequest request, UUID companyId, DocumentType documentType, Dossier dossier) {
        if (request == null) return null;
        return Document.builder()
                .companyId(companyId)
                .documentCode(request.getDocumentCode().trim().toUpperCase())
                .title(request.getTitle().trim())
                .dossier(dossier)
                .documentType(documentType)
                .employeeId(request.getEmployeeId())
                .status(DocumentStatus.DRAFT)
                .isLegalHold(false)
                .issueDate(request.getIssueDate())
                .expiryDate(request.getExpiryDate())
                .retentionPolicy(documentType.getRetentionPolicy())
                .build();
    }

    public void updateEntity(Document entity, DocumentDto.UpdateRequest request, Dossier dossier) {
        if (entity == null || request == null) return;
        entity.setTitle(request.getTitle().trim());
        entity.setDossier(dossier);
        entity.setIssueDate(request.getIssueDate());
        entity.setExpiryDate(request.getExpiryDate());
    }

    public DocumentDto.Response toResponse(Document entity, String employeeCode, String employeeFullName) {
        if (entity == null) return null;

        DocumentVersion currentVersion = null;
        if (entity.getVersions() != null) {
            currentVersion = entity.getVersions().stream()
                    .filter(DocumentVersion::getIsCurrent)
                    .findFirst()
                    .orElse(entity.getVersions().isEmpty() ? null : entity.getVersions().get(0));
        }

        return DocumentDto.Response.builder()
                .id(entity.getId())
                .companyId(entity.getCompanyId())
                .documentCode(entity.getDocumentCode())
                .title(entity.getTitle())
                .dossierId(entity.getDossier() != null ? entity.getDossier().getId() : null)
                .dossierTitle(entity.getDossier() != null ? entity.getDossier().getTitle() : null)
                .documentTypeId(entity.getDocumentType() != null ? entity.getDocumentType().getId() : null)
                .documentTypeCode(entity.getDocumentType() != null ? entity.getDocumentType().getCode() : null)
                .documentTypeName(entity.getDocumentType() != null ? entity.getDocumentType().getName() : null)
                .isSensitive(entity.getDocumentType() != null ? entity.getDocumentType().getIsSensitive() : false)
                .employeeId(entity.getEmployeeId())
                .employeeCode(employeeCode)
                .employeeFullName(employeeFullName)
                .status(entity.getStatus())
                .isLegalHold(entity.getIsLegalHold())
                .issueDate(entity.getIssueDate())
                .expiryDate(entity.getExpiryDate())
                .retentionUntil(entity.getRetentionUntil())
                .isDigitallySigned(entity.getIsDigitallySigned())
                .digitallySignedAt(entity.getDigitallySignedAt())
                .currentVersionNo(currentVersion != null ? currentVersion.getVersionNo() : null)
                .currentFileUrl(currentVersion != null ? currentVersion.getFileUrl() : null)
                .currentSha256(currentVersion != null ? currentVersion.getSha256Checksum() : null)
                .createdAt(entity.getCreatedAt())
                .build();
    }

    public DocumentDto.DetailResponse toDetailResponse(
            Document entity,
            String employeeCode,
            String employeeFullName,
            String departmentName,
            String positionTitle,
            String verifiedByUserName,
            String archivedByUserName,
            String signedByUserName,
            List<DocumentDto.MetadataValueResponse> metadataValues) {
        if (entity == null) return null;

        List<DocumentVersionDto.Response> versionResponses = entity.getVersions() != null
                ? versionMapper.toResponseList(entity.getVersions())
                : Collections.emptyList();

        DocumentVersionDto.Response currentVersion = versionResponses.stream()
                .filter(v -> Boolean.TRUE.equals(v.getIsCurrent()))
                .findFirst()
                .orElse(versionResponses.isEmpty() ? null : versionResponses.get(0));

        return DocumentDto.DetailResponse.builder()
                .id(entity.getId())
                .companyId(entity.getCompanyId())
                .documentCode(entity.getDocumentCode())
                .title(entity.getTitle())
                .dossierId(entity.getDossier() != null ? entity.getDossier().getId() : null)
                .dossierTitle(entity.getDossier() != null ? entity.getDossier().getTitle() : null)
                .documentTypeId(entity.getDocumentType() != null ? entity.getDocumentType().getId() : null)
                .documentTypeCode(entity.getDocumentType() != null ? entity.getDocumentType().getCode() : null)
                .documentTypeName(entity.getDocumentType() != null ? entity.getDocumentType().getName() : null)
                .isSensitive(entity.getDocumentType() != null ? entity.getDocumentType().getIsSensitive() : false)
                .employeeId(entity.getEmployeeId())
                .employeeCode(employeeCode)
                .employeeFullName(employeeFullName)
                .departmentName(departmentName)
                .positionTitle(positionTitle)
                .status(entity.getStatus())
                .isLegalHold(entity.getIsLegalHold())
                .issueDate(entity.getIssueDate())
                .expiryDate(entity.getExpiryDate())
                .retentionPolicyId(entity.getRetentionPolicy() != null ? entity.getRetentionPolicy().getId() : null)
                .retentionPolicyName(entity.getRetentionPolicy() != null ? entity.getRetentionPolicy().getName() : null)
                .retentionMonths(entity.getRetentionPolicy() != null ? entity.getRetentionPolicy().getRetentionMonths() : null)
                .retentionUntil(entity.getRetentionUntil())
                .verifiedByUserId(entity.getVerifiedByUserId())
                .verifiedByUserName(verifiedByUserName)
                .verifiedAt(entity.getVerifiedAt())
                .archivedByUserId(entity.getArchivedByUserId())
                .archivedByUserName(archivedByUserName)
                .archivedAt(entity.getArchivedAt())
                .isDigitallySigned(entity.getIsDigitallySigned())
                .digitallySignedAt(entity.getDigitallySignedAt())
                .signedByUserId(entity.getSignedByUserId())
                .signedByUserName(signedByUserName)
                .digitalSignatureValue(entity.getDigitalSignatureValue())
                .destroyedAt(entity.getDestroyedAt())
                .destructionProposalId(entity.getDestructionProposalId())
                .metadataValues(metadataValues != null ? metadataValues : Collections.emptyList())
                .versions(versionResponses)
                .currentVersion(currentVersion)
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
