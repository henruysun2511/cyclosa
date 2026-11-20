package com.cyclosa.document.mapper;

import com.cyclosa.document.dto.DocumentDto;
import com.cyclosa.document.dto.DossierDto;
import com.cyclosa.document.entity.Dossier;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class DossierMapper {

    public Dossier toEntity(DossierDto.CreateRequest request, UUID companyId) {
        if (request == null) return null;
        return Dossier.builder()
                .companyId(companyId)
                .employeeId(request.getEmployeeId())
                .dossierCode(request.getDossierCode().trim().toUpperCase())
                .title(request.getTitle().trim())
                .purpose(request.getPurpose())
                .description(request.getDescription())
                .build();
    }

    public void updateEntity(Dossier entity, DossierDto.UpdateRequest request) {
        if (entity == null || request == null) return;
        entity.setTitle(request.getTitle().trim());
        if (request.getPurpose() != null) entity.setPurpose(request.getPurpose());
        if (request.getStatus() != null) entity.setStatus(request.getStatus());
        entity.setDescription(request.getDescription());
    }

    public DossierDto.Response toResponse(Dossier entity, String employeeCode, String employeeFullName) {
        if (entity == null) return null;
        return DossierDto.Response.builder()
                .id(entity.getId())
                .companyId(entity.getCompanyId())
                .employeeId(entity.getEmployeeId())
                .employeeCode(employeeCode)
                .employeeFullName(employeeFullName)
                .dossierCode(entity.getDossierCode())
                .title(entity.getTitle())
                .purpose(entity.getPurpose())
                .status(entity.getStatus())
                .documentCount(entity.getDocuments() != null ? entity.getDocuments().size() : 0)
                .createdAt(entity.getCreatedAt())
                .build();
    }

    public DossierDto.DetailResponse toDetailResponse(
            Dossier entity,
            String employeeCode,
            String employeeFullName,
            String departmentName,
            String positionTitle,
            List<DocumentDto.Response> documents) {
        if (entity == null) return null;
        return DossierDto.DetailResponse.builder()
                .id(entity.getId())
                .companyId(entity.getCompanyId())
                .employeeId(entity.getEmployeeId())
                .employeeCode(employeeCode)
                .employeeFullName(employeeFullName)
                .departmentName(departmentName)
                .positionTitle(positionTitle)
                .dossierCode(entity.getDossierCode())
                .title(entity.getTitle())
                .purpose(entity.getPurpose())
                .status(entity.getStatus())
                .description(entity.getDescription())
                .documents(documents != null ? documents : Collections.emptyList())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
