package com.cyclosa.assistant.dto.response;

import com.cyclosa.assistant.enums.KnowledgeCategory;
import com.cyclosa.assistant.enums.KnowledgeDocumentStatus;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KnowledgeDocumentResponse {
    private UUID id;
    private String title;
    private KnowledgeCategory category;
    private String categoryDescription;
    private String version;
    private String fileUrl;
    private Long fileSize;
    private KnowledgeDocumentStatus status;
    private long chunkCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
