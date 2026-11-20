package com.cyclosa.document.mapper;

import com.cyclosa.document.dto.DocumentVersionDto;
import com.cyclosa.document.entity.Document;
import com.cyclosa.document.entity.DocumentSourceFile;
import com.cyclosa.document.entity.DocumentVersion;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class DocumentVersionMapper {

    public DocumentVersion toEntity(DocumentVersionDto.CreateVersionRequest request, Document document, Integer versionNo, DocumentSourceFile sourceFile) {
        if (request == null) return null;
        return DocumentVersion.builder()
                .document(document)
                .versionNo(versionNo)
                .sourceFile(sourceFile)
                .fileUrl(request.getFileUrl())
                .fileFormat(request.getFileFormat())
                .fileSize(request.getFileSize())
                .sha256Checksum(request.getSha256Checksum())
                .pageFrom(request.getPageFrom() != null ? request.getPageFrom() : 1)
                .pageTo(request.getPageTo() != null ? request.getPageTo() : 1)
                .changeReason(request.getChangeReason())
                .isCurrent(true)
                .build();
    }

    public DocumentVersionDto.Response toResponse(DocumentVersion entity) {
        if (entity == null) return null;
        return DocumentVersionDto.Response.builder()
                .id(entity.getId())
                .documentId(entity.getDocument() != null ? entity.getDocument().getId() : null)
                .versionNo(entity.getVersionNo())
                .sourceFileId(entity.getSourceFile() != null ? entity.getSourceFile().getId() : null)
                .fileUrl(entity.getFileUrl())
                .fileFormat(entity.getFileFormat())
                .fileSize(entity.getFileSize())
                .sha256Checksum(entity.getSha256Checksum())
                .pageFrom(entity.getPageFrom())
                .pageTo(entity.getPageTo())
                .changeReason(entity.getChangeReason())
                .isCurrent(entity.getIsCurrent())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    public List<DocumentVersionDto.Response> toResponseList(List<DocumentVersion> entities) {
        if (entities == null) return Collections.emptyList();
        return entities.stream().map(this::toResponse).collect(Collectors.toList());
    }
}
