package com.cyclosa.document.mapper;

import com.cyclosa.document.dto.DocumentMetadataFieldDto;
import com.cyclosa.document.entity.DocumentMetadataField;
import com.cyclosa.document.entity.DocumentType;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class DocumentMetadataFieldMapper {

    public DocumentMetadataField toEntity(DocumentMetadataFieldDto.CreateRequest request, DocumentType documentType) {
        if (request == null) return null;
        return DocumentMetadataField.builder()
                .documentType(documentType)
                .fieldKey(request.getFieldKey().trim().toLowerCase())
                .label(request.getLabel().trim())
                .dataType(request.getDataType())
                .isRequired(Boolean.TRUE.equals(request.getIsRequired()))
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                .validationRegex(request.getValidationRegex())
                .optionsJson(request.getOptionsJson())
                .build();
    }

    public DocumentMetadataFieldDto.Response toResponse(DocumentMetadataField entity) {
        if (entity == null) return null;
        return DocumentMetadataFieldDto.Response.builder()
                .id(entity.getId())
                .documentTypeId(entity.getDocumentType() != null ? entity.getDocumentType().getId() : null)
                .fieldKey(entity.getFieldKey())
                .label(entity.getLabel())
                .dataType(entity.getDataType())
                .isRequired(entity.getIsRequired())
                .displayOrder(entity.getDisplayOrder())
                .validationRegex(entity.getValidationRegex())
                .optionsJson(entity.getOptionsJson())
                .build();
    }

    public List<DocumentMetadataFieldDto.Response> toResponseList(List<DocumentMetadataField> entities) {
        if (entities == null) return Collections.emptyList();
        return entities.stream().map(this::toResponse).collect(Collectors.toList());
    }
}
