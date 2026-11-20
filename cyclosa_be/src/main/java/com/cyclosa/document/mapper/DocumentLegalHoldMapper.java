package com.cyclosa.document.mapper;

import com.cyclosa.document.dto.DocumentLegalHoldDto;
import com.cyclosa.document.entity.Document;
import com.cyclosa.document.entity.DocumentLegalHold;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class DocumentLegalHoldMapper {

    public DocumentLegalHold toEntity(DocumentLegalHoldDto.PlaceHoldRequest request, Document document, String holdCode, UUID placedByUserId) {
        if (request == null) return null;
        return DocumentLegalHold.builder()
                .companyId(document.getCompanyId())
                .document(document)
                .holdCode(holdCode)
                .reason(request.getReason())
                .note(request.getNote())
                .placedByUserId(placedByUserId)
                .build();
    }

    public DocumentLegalHoldDto.Response toResponse(DocumentLegalHold entity, String placedByUserName, String releasedByUserName) {
        if (entity == null) return null;
        return DocumentLegalHoldDto.Response.builder()
                .id(entity.getId())
                .companyId(entity.getCompanyId())
                .documentId(entity.getDocument() != null ? entity.getDocument().getId() : null)
                .documentCode(entity.getDocument() != null ? entity.getDocument().getDocumentCode() : null)
                .documentTitle(entity.getDocument() != null ? entity.getDocument().getTitle() : null)
                .holdCode(entity.getHoldCode())
                .reason(entity.getReason())
                .note(entity.getNote())
                .placedByUserId(entity.getPlacedByUserId())
                .placedByUserName(placedByUserName)
                .placedAt(entity.getPlacedAt())
                .releasedByUserId(entity.getReleasedByUserId())
                .releasedByUserName(releasedByUserName)
                .releasedAt(entity.getReleasedAt())
                .releaseNote(entity.getReleaseNote())
                .isReleased(entity.isReleased())
                .build();
    }

    public List<DocumentLegalHoldDto.Response> toResponseList(List<DocumentLegalHold> entities) {
        if (entities == null) return Collections.emptyList();
        return entities.stream().map(e -> toResponse(e, null, null)).collect(Collectors.toList());
    }
}
