package com.cyclosa.document.mapper;

import com.cyclosa.document.dto.DocumentSourceFileDto;
import com.cyclosa.document.entity.DocumentSourceFile;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class DocumentSourceFileMapper {

    public DocumentSourceFileDto.Response toResponse(DocumentSourceFile entity) {
        if (entity == null) return null;
        return DocumentSourceFileDto.Response.builder()
                .id(entity.getId())
                .companyId(entity.getCompanyId())
                .fileId(entity.getFileId())
                .fileName(entity.getFileName())
                .filePath(entity.getFilePath())
                .fileSize(entity.getFileSize())
                .mimeType(entity.getMimeType())
                .dpi(entity.getDpi())
                .totalPages(entity.getTotalPages())
                .qualityStatus(entity.getQualityStatus())
                .rejectionReason(entity.getRejectionReason())
                .ocrRawText(entity.getOcrRawText())
                .ocrStatus(entity.getOcrStatus())
                .uploadedByUserId(entity.getUploadedByUserId())
                .uploadedAt(entity.getUploadedAt())
                .build();
    }

    public List<DocumentSourceFileDto.Response> toResponseList(List<DocumentSourceFile> entities) {
        if (entities == null) return Collections.emptyList();
        return entities.stream().map(this::toResponse).collect(Collectors.toList());
    }
}
