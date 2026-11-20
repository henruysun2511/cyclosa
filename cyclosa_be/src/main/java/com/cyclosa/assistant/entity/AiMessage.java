package com.cyclosa.assistant.entity;

import com.cyclosa.assistant.enums.AiMessageFeedback;
import com.cyclosa.assistant.enums.AiMessageRole;
import com.cyclosa.assistant.enums.AiResponseType;
import com.cyclosa.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "ai_messages", indexes = {
        @Index(name = "idx_ai_msg_conversation_id", columnList = "conversation_id"),
        @Index(name = "idx_ai_msg_role", columnList = "role"),
        @Index(name = "idx_ai_msg_created_at", columnList = "created_at")
})
@SQLDelete(sql = "UPDATE ai_messages SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiMessage extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conversation_id", nullable = false)
    private AiConversation conversation;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 20)
    private AiMessageRole role;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(name = "response_type", length = 50)
    private AiResponseType responseType;

    @Column(name = "function_calls", columnDefinition = "TEXT")
    private String functionCalls;

    @Column(name = "source_documents", columnDefinition = "TEXT")
    private String sourceDocuments;

    @Column(name = "chart_config", columnDefinition = "TEXT")
    private String chartConfig;

    @Column(name = "token_usage")
    private Integer tokenUsage;

    @Enumerated(EnumType.STRING)
    @Column(name = "feedback", length = 20)
    private AiMessageFeedback feedback;

    @Column(name = "feedback_note", columnDefinition = "TEXT")
    private String feedbackNote;
}
