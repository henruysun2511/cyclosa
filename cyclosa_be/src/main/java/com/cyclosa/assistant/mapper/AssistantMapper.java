package com.cyclosa.assistant.mapper;

import com.cyclosa.assistant.dto.response.*;
import com.cyclosa.assistant.entity.*;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class AssistantMapper {

    public ConversationSummaryResponse toSummaryResponse(AiConversation entity, long messageCount) {
        if (entity == null) return null;
        return ConversationSummaryResponse.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .status(entity.getStatus())
                .messageCount(messageCount)
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public MessageDetailResponse toMessageResponse(AiMessage entity) {
        if (entity == null) return null;
        return MessageDetailResponse.builder()
                .id(entity.getId())
                .role(entity.getRole())
                .content(entity.getContent())
                .responseType(entity.getResponseType())
                .functionCalls(entity.getFunctionCalls())
                .sourceDocuments(entity.getSourceDocuments())
                .chartConfig(entity.getChartConfig())
                .tokenUsage(entity.getTokenUsage())
                .feedback(entity.getFeedback())
                .feedbackNote(entity.getFeedbackNote())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    public ConversationDetailResponse toDetailResponse(AiConversation entity, List<AiMessage> messages) {
        if (entity == null) return null;
        List<MessageDetailResponse> messageResponses = messages != null
                ? messages.stream().map(this::toMessageResponse).collect(Collectors.toList())
                : new ArrayList<>();

        return ConversationDetailResponse.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .messages(messageResponses)
                .build();
    }

    public KnowledgeDocumentResponse toKnowledgeDocResponse(KnowledgeBaseDocument entity, long chunkCount) {
        if (entity == null) return null;
        return KnowledgeDocumentResponse.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .category(entity.getCategory())
                .categoryDescription(entity.getCategory() != null ? entity.getCategory().getDescription() : null)
                .version(entity.getVersion())
                .fileUrl(entity.getFileUrl())
                .fileSize(entity.getFileSize())
                .status(entity.getStatus())
                .chunkCount(chunkCount)
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public UnansweredQuestionResponse toUnansweredQuestionResponse(AiUnansweredQuestion entity) {
        if (entity == null) return null;
        return UnansweredQuestionResponse.builder()
                .id(entity.getId())
                .questionText(entity.getQuestionText())
                .clusterId(entity.getClusterId())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .resolvedAt(entity.getResolvedAt())
                .build();
    }
}
