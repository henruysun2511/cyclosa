package com.cyclosa.document.mapper;

import com.cyclosa.document.dto.DocumentTypeDto;
import com.cyclosa.document.entity.DocumentType;
import com.cyclosa.document.entity.RetentionPolicy;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class DocumentTypeMapper {

    private final DocumentMetadataFieldMapper fieldMapper;

    public DocumentType toEntity(DocumentTypeDto.CreateRequest request, UUID companyId, RetentionPolicy policy) {
        if (request == null) return null;
        return DocumentType.builder()
                .companyId(companyId)
                .code(request.getCode().trim().toUpperCase())
                .name(request.getName().trim())
                .retentionPolicy(policy)
                .isSensitive(Boolean.TRUE.equals(request.getIsSensitive()))
                .description(request.getDescription())
                .build();
    }

    public void updateEntity(DocumentType entity, DocumentTypeDto.UpdateRequest request, RetentionPolicy policy) {
        if (entity == null || request == null) return;
        entity.setName(request.getName().trim());
        entity.setRetentionPolicy(policy);
        if (request.getIsSensitive() != null) {
            entity.setIsSensitive(request.getIsSensitive());
        }
        entity.setDescription(request.getDescription());
    }

    public DocumentTypeDto.SimpleResponse toSimpleResponse(DocumentType entity) {
        if (entity == null) return null;
        return DocumentTypeDto.SimpleResponse.builder()
                .id(entity.getId())
                .code(entity.getCode())
                .name(entity.getName())
                .isSensitive(entity.getIsSensitive())
                .build();
    }

    public DocumentTypeDto.Response toResponse(DocumentType entity) {
        if (entity == null) return null;
        return DocumentTypeDto.Response.builder()
                .id(entity.getId())
                .companyId(entity.getCompanyId())
                .code(entity.getCode())
                .name(entity.getName())
                .retentionPolicyId(entity.getRetentionPolicy() != null ? entity.getRetentionPolicy().getId() : null)
                .retentionPolicyName(entity.getRetentionPolicy() != null ? entity.getRetentionPolicy().getName() : null)
                .retentionMonths(entity.getRetentionPolicy() != null ? entity.getRetentionPolicy().getRetentionMonths() : null)
                .isSensitive(entity.getIsSensitive())
                .description(entity.getDescription())
                .metadataFields(entity.getMetadataFields() != null ? fieldMapper.toResponseList(entity.getMetadataFields()) : Collections.emptyList())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public List<DocumentTypeDto.Response> toResponseList(List<DocumentType> entities) {
        if (entities == null) return Collections.emptyList();
        return entities.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<DocumentTypeDto.SimpleResponse> toSimpleResponseList(List<DocumentType> entities) {
        if (entities == null) return Collections.emptyList();
        return entities.stream().map(this::toSimpleResponse).collect(Collectors.toList());
    }
}
