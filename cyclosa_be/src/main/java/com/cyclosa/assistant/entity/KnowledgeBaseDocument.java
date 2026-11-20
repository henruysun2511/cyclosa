package com.cyclosa.assistant.entity;

import com.cyclosa.assistant.enums.KnowledgeCategory;
import com.cyclosa.assistant.enums.KnowledgeDocumentStatus;
import com.cyclosa.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "knowledge_base_documents", indexes = {
        @Index(name = "idx_kb_doc_company_id", columnList = "company_id"),
        @Index(name = "idx_kb_doc_category", columnList = "category"),
        @Index(name = "idx_kb_doc_status", columnList = "status")
})
@SQLDelete(sql = "UPDATE knowledge_base_documents SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KnowledgeBaseDocument extends BaseEntity {

    @Column(name = "company_id", nullable = false)
    private UUID companyId;

    @Column(name = "title", nullable = false, length = 500)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false, length = 50)
    private KnowledgeCategory category;

    @Column(name = "version", nullable = false, length = 30)
    @Builder.Default
    private String version = "v1.0";

    @Column(name = "file_url", length = 1000)
    private String fileUrl;

    @Column(name = "file_size")
    private Long fileSize;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    @Builder.Default
    private KnowledgeDocumentStatus status = KnowledgeDocumentStatus.ACTIVE;

    @Column(name = "archived_at")
    private LocalDateTime archivedAt;

    @OneToMany(mappedBy = "document", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<KnowledgeBaseChunk> chunks = new ArrayList<>();
}
