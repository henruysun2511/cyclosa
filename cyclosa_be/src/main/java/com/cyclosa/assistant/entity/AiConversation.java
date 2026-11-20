package com.cyclosa.assistant.entity;

import com.cyclosa.assistant.enums.AiConversationStatus;
import com.cyclosa.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "ai_conversations", indexes = {
        @Index(name = "idx_ai_conv_company_id", columnList = "company_id"),
        @Index(name = "idx_ai_conv_user_id", columnList = "user_id"),
        @Index(name = "idx_ai_conv_status", columnList = "status"),
        @Index(name = "idx_ai_conv_created_at", columnList = "created_at")
})
@SQLDelete(sql = "UPDATE ai_conversations SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiConversation extends BaseEntity {

    @Column(name = "company_id", nullable = false)
    private UUID companyId;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    @Builder.Default
    private AiConversationStatus status = AiConversationStatus.ACTIVE;

    @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("createdAt ASC")
    @Builder.Default
    private List<AiMessage> messages = new ArrayList<>();
}
