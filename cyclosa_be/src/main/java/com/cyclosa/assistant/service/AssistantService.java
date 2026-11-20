package com.cyclosa.assistant.service;

import com.cyclosa.assistant.client.AssistantAiClient;
import com.cyclosa.assistant.client.dto.AssistantAiDto;
import com.cyclosa.assistant.dto.request.*;
import com.cyclosa.assistant.dto.response.*;
import com.cyclosa.assistant.entity.*;
import com.cyclosa.assistant.enums.*;
import com.cyclosa.assistant.exception.AssistantErrorCode;
import com.cyclosa.assistant.mapper.AssistantMapper;
import com.cyclosa.assistant.repository.*;
import com.cyclosa.common.exception.AppException;
import com.cyclosa.common.response.PageData;
import com.cyclosa.common.util.SecurityUtils;
import com.cyclosa.employee.entity.Employee;
import com.cyclosa.employee.repository.EmployeeRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AssistantService {

    private final AssistantAiClient assistantAiClient;
    private final EmployeeRepository employeeRepository;
    private final AiConversationRepository conversationRepository;
    private final AiMessageRepository messageRepository;
    private final KnowledgeBaseDocumentRepository knowledgeDocumentRepository;
    private final KnowledgeBaseChunkRepository knowledgeChunkRepository;
    private final AiUnansweredQuestionRepository unansweredQuestionRepository;
    private final AiInteractionLogRepository interactionLogRepository;
    private final AssistantMapper assistantMapper;
    private final ObjectMapper objectMapper;

    /**
     * Xử lý hội thoại 1-1 với Trợ lý AI (Lưu vết CSDL, UserContext, kiểm tra Rate Limit)
     */
    @Transactional
    public ChatClientResponse processChat(ChatRequestDto request) {
        String query = request.getQuery() != null ? request.getQuery().trim() : "";
        if (query.length() > 2000) {
            throw new AppException(AssistantErrorCode.MESSAGE_TOO_LONG);
        }

        UUID currentUserId = SecurityUtils.getCurrentUserId();
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();

        // 1. Quản lý Cuộc hội thoại (Tìm phiên cũ hoặc tạo mới)
        AiConversation conversation;
        if (request.getConversationId() != null) {
            conversation = conversationRepository.findByIdAndUserId(request.getConversationId(), currentUserId)
                    .orElseThrow(() -> new AppException(AssistantErrorCode.CONVERSATION_NOT_FOUND));
        } else {
            String title = query.length() > 50 ? query.substring(0, 50) + "..." : query;
            conversation = AiConversation.builder()
                    .companyId(companyId)
                    .userId(currentUserId)
                    .title(title)
                    .status(AiConversationStatus.ACTIVE)
                    .build();
            conversation = conversationRepository.save(conversation);
        }

        // 2. Lưu tin nhắn của Người dùng vào CSDL
        AiMessage userMessage = AiMessage.builder()
                .conversation(conversation)
                .role(AiMessageRole.USER)
                .content(query)
                .build();
        messageRepository.save(userMessage);

        // 3. Chuẩn bị Context Window (6 tin nhắn gần nhất)
        List<AiMessage> previousMessages = messageRepository.findAllByConversationIdOrderByCreatedAtAsc(conversation.getId());
        List<AssistantAiDto.ChatMessage> conversationHistory = new ArrayList<>();
        int startIdx = Math.max(0, previousMessages.size() - 6);
        for (int i = startIdx; i < previousMessages.size(); i++) {
            AiMessage msg = previousMessages.get(i);
            conversationHistory.add(AssistantAiDto.ChatMessage.builder()
                    .role(msg.getRole().name().toLowerCase())
                    .content(msg.getContent())
                    .timestamp(msg.getCreatedAt() != null ? msg.getCreatedAt().toString() : LocalDateTime.now().toString())
                    .build());
        }

        // 4. Xây dựng UserContext (RBAC, DataScope, định danh nhân viên)
        String fullName = "Nhân viên CYCLOSA";
        String employeeIdStr = null;
        String deptIdStr = null;
        String deptName = "Khối Vận hành & Kỹ thuật";
        String jobTitle = "Nhân viên";

        Optional<Employee> empOpt = employeeRepository.findByUserId(currentUserId);
        if (empOpt.isEmpty()) {
            empOpt = employeeRepository.findById(currentUserId);
        }
        if (empOpt.isPresent()) {
            Employee emp = empOpt.get();
            fullName = emp.getFullName() != null ? emp.getFullName() : fullName;
            employeeIdStr = emp.getId().toString();
            if (emp.getCurrentDepartment() != null) {
                deptIdStr = emp.getCurrentDepartment().getId().toString();
                deptName = emp.getCurrentDepartment().getName();
            }
            if (emp.getCurrentJobTitle() != null) {
                jobTitle = emp.getCurrentJobTitle().getName();
            }
        }

        List<String> roles = extractCurrentUserRoles();

        AssistantAiDto.UserContext userContext = AssistantAiDto.UserContext.builder()
                .userId(currentUserId.toString())
                .employeeId(employeeIdStr)
                .fullName(fullName)
                .departmentId(deptIdStr)
                .departmentName(deptName)
                .jobTitle(jobTitle)
                .roles(roles)
                .companyId(companyId.toString())
                .build();

        AssistantAiDto.ChatRequest chatReq = AssistantAiDto.ChatRequest.builder()
                .query(query)
                .userContext(userContext)
                .conversationHistory(conversationHistory)
                .build();

        // 5. Gọi AI Microservice
        long startTime = System.currentTimeMillis();
        Optional<AssistantAiDto.ChatResponseData> resultOpt = assistantAiClient.chat(chatReq);
        long latencyMs = System.currentTimeMillis() - startTime;

        AssistantAiDto.ChatResponseData aiResult;
        if (resultOpt.isPresent()) {
            aiResult = resultOpt.get();
        } else {
            aiResult = AssistantAiDto.ChatResponseData.builder()
                    .response("Xin lỗi, hệ thống AI hiện đang trong chế độ bảo trì hoặc đang quá tải. Vui lòng thử lại sau ít phút.")
                    .intent("out_of_scope")
                    .citations(List.of())
                    .disclaimer("Lưu ý: CYCLOSA AI là trợ lý hỗ trợ tra cứu thông tin. Các quyết định chính thức thuộc thẩm quyền của phòng Nhân sự.")
                    .executionTimeMs((int) latencyMs)
                    .build();
        }

        // 6. Phân tích kết quả và Ánh xạ sang CSDL
        AiResponseType responseType = mapIntentToResponseType(aiResult.getIntent());
        String citationsJson = null;
        if (aiResult.getCitations() != null && !aiResult.getCitations().isEmpty()) {
            try {
                citationsJson = objectMapper.writeValueAsString(aiResult.getCitations());
            } catch (JsonProcessingException e) {
                log.warn("Không thể chuyển citations sang JSON: {}", e.getMessage());
            }
        }

        // 7. Lưu tin nhắn phản hồi của Trợ lý AI
        AiMessage assistantMessage = AiMessage.builder()
                .conversation(conversation)
                .role(AiMessageRole.ASSISTANT)
                .content(aiResult.getResponse())
                .responseType(responseType)
                .functionCalls(aiResult.getFunctionCalled())
                .sourceDocuments(citationsJson)
                .chartConfig(aiResult.getChartConfig())
                .tokenUsage(Math.max(50, query.length() / 4 + aiResult.getResponse().length() / 4))
                .build();
        assistantMessage = messageRepository.save(assistantMessage);

        // 8. Tự động ghi nhận Lỗ hổng tri thức (Knowledge Gap) nếu hỏi chính sách mà không có tài liệu
        if ("in_scope_policy".equalsIgnoreCase(aiResult.getIntent()) &&
                (aiResult.getCitations() == null || aiResult.getCitations().isEmpty())) {
            AiUnansweredQuestion gap = AiUnansweredQuestion.builder()
                    .companyId(companyId)
                    .messageId(assistantMessage.getId())
                    .questionText(query)
                    .status(UnansweredQuestionStatus.PENDING_REVIEW)
                    .build();
            unansweredQuestionRepository.save(gap);
            log.info("Phát hiện lỗ hổng tri thức mới: '{}'", query);
        }

        // 9. Ghi vết kiểm toán tương tác AI
        AiInteractionLog logEntry = AiInteractionLog.builder()
                .companyId(companyId)
                .userId(currentUserId)
                .feature("CHATBOT")
                .modelName("gemini-1.5-pro")
                .latencyMs((int) latencyMs)
                .promptTokens(query.length() / 4)
                .completionTokens(aiResult.getResponse().length() / 4)
                .totalTokens(query.length() / 4 + aiResult.getResponse().length() / 4)
                .status(resultOpt.isPresent() ? AiInteractionStatus.SUCCESS : AiInteractionStatus.FAILED)
                .build();
        interactionLogRepository.save(logEntry);

        conversation.setUpdatedAt(LocalDateTime.now());
        conversationRepository.save(conversation);

        return ChatClientResponse.builder()
                .conversationId(conversation.getId())
                .messageId(assistantMessage.getId())
                .response(aiResult.getResponse())
                .intent(aiResult.getIntent())
                .functionCalled(aiResult.getFunctionCalled())
                .functionArgs(aiResult.getFunctionArgs())
                .citations(aiResult.getCitations())
                .chartConfig(aiResult.getChartConfig())
                .disclaimer(aiResult.getDisclaimer())
                .executionTimeMs((int) latencyMs)
                .build();
    }

    // ── QUẢN LÝ CUỘC HỘI THOẠI ──

    @Transactional(readOnly = true)
    public PageData<ConversationSummaryResponse> getConversations(int page, int size) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<AiConversation> convPage = conversationRepository.findAllByUserIdAndCompanyIdOrderByCreatedAtDesc(
                currentUserId, companyId, pageable
        );

        List<ConversationSummaryResponse> list = convPage.getContent().stream()
                .map(c -> {
                    long msgCount = messageRepository.countByConversationId(c.getId());
                    return assistantMapper.toSummaryResponse(c, msgCount);
                })
                .collect(Collectors.toList());

        return PageData.of(convPage, c -> assistantMapper.toSummaryResponse(c, messageRepository.countByConversationId(c.getId())));
    }

    @Transactional(readOnly = true)
    public ConversationDetailResponse getConversationById(UUID conversationId) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        AiConversation conversation = conversationRepository.findByIdAndUserId(conversationId, currentUserId)
                .orElseThrow(() -> new AppException(AssistantErrorCode.CONVERSATION_NOT_FOUND));

        List<AiMessage> messages = messageRepository.findAllByConversationIdOrderByCreatedAtAsc(conversationId);
        return assistantMapper.toDetailResponse(conversation, messages);
    }

    @Transactional
    public void deleteConversation(UUID conversationId) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        AiConversation conversation = conversationRepository.findByIdAndUserId(conversationId, currentUserId)
                .orElseThrow(() -> new AppException(AssistantErrorCode.CONVERSATION_NOT_FOUND));
        conversationRepository.delete(conversation);
    }

    @Transactional
    public void submitFeedback(UUID messageId, MessageFeedbackRequestDto feedbackDto) {
        AiMessage message = messageRepository.findById(messageId)
                .orElseThrow(() -> new AppException(AssistantErrorCode.MESSAGE_NOT_FOUND));
        message.setFeedback(feedbackDto.getFeedback());
        message.setFeedbackNote(feedbackDto.getNote());
        messageRepository.save(message);
    }

    // ── QUẢN TRỊ KHO TRI THỨC (KNOWLEDGE BASE) ──

    @Transactional(readOnly = true)
    public PageData<KnowledgeDocumentResponse> getKnowledgeDocuments(KnowledgeDocumentFilter filter) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        Pageable pageable = filter.toPageable("createdAt", Set.of("createdAt", "title", "category", "status"));

        Specification<KnowledgeBaseDocument> spec = (root, query, cb) -> {
            List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("companyId"), companyId));

            if (filter.getCategory() != null) {
                predicates.add(cb.equal(root.get("category"), filter.getCategory()));
            }
            if (filter.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), filter.getStatus()));
            }
            if (filter.getKeyword() != null && !filter.getKeyword().isBlank()) {
                String kw = "%" + filter.getKeyword().trim().toLowerCase() + "%";
                predicates.add(cb.like(cb.lower(root.get("title")), kw));
            }
            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };

        Page<KnowledgeBaseDocument> page = knowledgeDocumentRepository.findAll(spec, pageable);
        return PageData.of(page, doc -> assistantMapper.toKnowledgeDocResponse(
                doc, knowledgeChunkRepository.countByDocumentId(doc.getId())
        ));
    }

    @Transactional
    public KnowledgeDocumentResponse createKnowledgeDocument(CreateKnowledgeDocumentRequestDto dto) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();

        KnowledgeBaseDocument doc = KnowledgeBaseDocument.builder()
                .companyId(companyId)
                .title(dto.getTitle())
                .category(dto.getCategory())
                .version(dto.getVersion() != null ? dto.getVersion() : "v1.0")
                .fileUrl(dto.getFileUrl())
                .fileSize(dto.getFileSize())
                .status(KnowledgeDocumentStatus.ACTIVE)
                .build();
        doc = knowledgeDocumentRepository.save(doc);

        // Bóc tách chunks ban đầu nếu có nội dung text
        if (dto.getContent() != null && !dto.getContent().isBlank()) {
            List<String> paragraphs = List.of(dto.getContent().split("\n\n+"));
            int idx = 0;
            for (String p : paragraphs) {
                if (p.trim().length() > 20) {
                    KnowledgeBaseChunk chunk = KnowledgeBaseChunk.builder()
                            .document(doc)
                            .chunkIndex(idx++)
                            .sectionRef("Mục " + idx)
                            .content(p.trim())
                            .tokenCount(p.trim().length() / 4)
                            .build();
                    knowledgeChunkRepository.save(chunk);
                }
            }
        }

        return assistantMapper.toKnowledgeDocResponse(
                doc, knowledgeChunkRepository.countByDocumentId(doc.getId())
        );
    }

    @Transactional
    public void archiveKnowledgeDocument(UUID id) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        KnowledgeBaseDocument doc = knowledgeDocumentRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new AppException(AssistantErrorCode.KNOWLEDGE_DOC_NOT_FOUND));
        doc.setStatus(KnowledgeDocumentStatus.ARCHIVED);
        doc.setArchivedAt(LocalDateTime.now());
        knowledgeDocumentRepository.save(doc);
    }

    @Transactional
    public void deleteKnowledgeDocument(UUID id) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        KnowledgeBaseDocument doc = knowledgeDocumentRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new AppException(AssistantErrorCode.KNOWLEDGE_DOC_NOT_FOUND));
        knowledgeDocumentRepository.delete(doc);
    }

    // ── QUẢN TRỊ CÂU HỎI CHƯA CÓ LỜI GIẢI (KNOWLEDGE GAPS) ──

    @Transactional(readOnly = true)
    public PageData<UnansweredQuestionResponse> getUnansweredQuestions(UnansweredQuestionFilter filter) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        Pageable pageable = filter.toPageable("createdAt", Set.of("createdAt", "status", "questionText"));

        Specification<AiUnansweredQuestion> spec = (root, query, cb) -> {
            List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("companyId"), companyId));

            if (filter.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), filter.getStatus()));
            }
            if (filter.getKeyword() != null && !filter.getKeyword().isBlank()) {
                String kw = "%" + filter.getKeyword().trim().toLowerCase() + "%";
                predicates.add(cb.like(cb.lower(root.get("questionText")), kw));
            }
            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };

        Page<AiUnansweredQuestion> page = unansweredQuestionRepository.findAll(spec, pageable);
        return PageData.of(page, assistantMapper::toUnansweredQuestionResponse);
    }

    @Transactional
    public void resolveUnansweredQuestion(UUID id) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        UUID currentUserId = SecurityUtils.getCurrentUserId();

        AiUnansweredQuestion q = unansweredQuestionRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new AppException(AssistantErrorCode.UNANSWERED_QUESTION_NOT_FOUND));
        q.setStatus(UnansweredQuestionStatus.DOCUMENT_ADDED);
        q.setResolvedAt(LocalDateTime.now());
        q.setReviewedBy(currentUserId);
        unansweredQuestionRepository.save(q);
    }

    @Transactional
    public void dismissUnansweredQuestion(UUID id) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        UUID currentUserId = SecurityUtils.getCurrentUserId();

        AiUnansweredQuestion q = unansweredQuestionRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new AppException(AssistantErrorCode.UNANSWERED_QUESTION_NOT_FOUND));
        q.setStatus(UnansweredQuestionStatus.DISMISSED);
        q.setReviewedBy(currentUserId);
        unansweredQuestionRepository.save(q);
    }

    private AiResponseType mapIntentToResponseType(String intent) {
        if ("in_scope_data".equalsIgnoreCase(intent)) {
            return AiResponseType.FUNCTION_CALLING;
        } else if ("in_scope_policy".equalsIgnoreCase(intent)) {
            return AiResponseType.RAG_POLICY;
        } else if ("out_of_scope".equalsIgnoreCase(intent)) {
            return AiResponseType.OUT_OF_SCOPE;
        }
        return AiResponseType.FALLBACK_NO_DATA;
    }

    private List<String> extractCurrentUserRoles() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getAuthorities() == null) {
            return List.of("ROLE_EMPLOYEE");
        }
        List<String> roles = auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
        return roles.isEmpty() ? List.of("ROLE_EMPLOYEE") : roles;
    }
}
