package com.cyclosa.document.mapper;

import com.cyclosa.document.dto.DossierExportRequestDto;
import com.cyclosa.document.entity.Dossier;
import com.cyclosa.document.entity.DossierExportRequest;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class DossierExportRequestMapper {

    public DossierExportRequest toEntity(DossierExportRequestDto.CreateRequest request, UUID companyId, UUID requestedByUserId, Dossier dossier) {
        if (request == null) return null;
        return DossierExportRequest.builder()
                .companyId(companyId)
                .employeeId(request.getEmployeeId())
                .dossier(dossier)
                .requestedByUserId(requestedByUserId)
                .exportFormat(request.getExportFormat())
                .watermarkText(request.getWatermarkText())
                .expiresAt(LocalDateTime.now().plusDays(7)) // Link tải hết hạn sau 7 ngày
                .build();
    }

    public DossierExportRequestDto.Response toResponse(DossierExportRequest entity, String employeeCode, String employeeFullName) {
        if (entity == null) return null;
        return DossierExportRequestDto.Response.builder()
                .id(entity.getId())
                .companyId(entity.getCompanyId())
                .employeeId(entity.getEmployeeId())
                .employeeCode(employeeCode)
                .employeeFullName(employeeFullName)
                .dossierId(entity.getDossier() != null ? entity.getDossier().getId() : null)
                .dossierTitle(entity.getDossier() != null ? entity.getDossier().getTitle() : null)
                .requestedByUserId(entity.getRequestedByUserId())
                .exportFormat(entity.getExportFormat())
                .watermarkText(entity.getWatermarkText())
                .status(entity.getStatus())
                .downloadUrl(entity.getDownloadUrl())
                .expiresAt(entity.getExpiresAt())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    public List<DossierExportRequestDto.Response> toResponseList(List<DossierExportRequest> entities) {
        if (entities == null) return Collections.emptyList();
        return entities.stream().map(e -> toResponse(e, null, null)).collect(Collectors.toList());
    }
}
