package com.cyclosa.assistant.controller;

import com.cyclosa.assistant.dto.request.*;
import com.cyclosa.assistant.dto.response.*;
import com.cyclosa.assistant.service.AssistantService;
import com.cyclosa.common.annotation.RequirePermission;
import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.common.response.PageData;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/assistant")
@RequiredArgsConstructor
@Tag(name = "AI Assistant & Chatbot", description = "Trợ lý AI 1-1 hỗ trợ tra cứu chính sách, dữ liệu HRM và Quản trị Kho Tri thức")
public class AssistantController {

    private final AssistantService assistantService;

    // ── 1. HỘI THOẠI & TIN NHẮN CHATBOT ──

    @PostMapping("/chat")
    @PreAuthorize("isAuthenticated()")
    @RequirePermission("ai.chat.use")
    @Operation(summary = "Hội thoại tương tác 1-1 với Trợ lý AI", description = "Hỗ trợ tra cứu quy chế, số liệu cá nhân và thống kê")
    public ResponseEntity<ApiResponse<ChatClientResponse>> chat(
            @Valid @RequestBody ChatRequestDto request) {
        ChatClientResponse response = assistantService.processChat(request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Trợ lý AI đã trả lời thành công"));
    }

    @GetMapping("/conversations")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Lấy danh sách các cuộc hội thoại gần đây của người dùng")
    public ResponseEntity<ApiResponse<PageData<ConversationSummaryResponse>>> getConversations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PageData<ConversationSummaryResponse> result = assistantService.getConversations(page, size);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách hội thoại thành công"));
    }

    @GetMapping("/conversations/{conversationId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Lấy chi tiết lịch sử tin nhắn của một cuộc hội thoại")
    public ResponseEntity<ApiResponse<ConversationDetailResponse>> getConversationById(
            @PathVariable UUID conversationId) {
        ConversationDetailResponse result = assistantService.getConversationById(conversationId);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy chi tiết cuộc hội thoại thành công"));
    }

    @DeleteMapping("/conversations/{conversationId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Xóa cuộc hội thoại cá nhân")
    public ResponseEntity<ApiResponse<Void>> deleteConversation(
            @PathVariable UUID conversationId) {
        assistantService.deleteConversation(conversationId);
        return ResponseEntity.ok(ApiResponse.ok(null, "Xóa cuộc hội thoại thành công"));
    }

    @PostMapping("/messages/{messageId}/feedback")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Gửi đánh giá chất lượng câu trả lời của AI (Helpful / Not Helpful)")
    public ResponseEntity<ApiResponse<Void>> submitFeedback(
            @PathVariable UUID messageId,
            @Valid @RequestBody MessageFeedbackRequestDto feedbackDto) {
        assistantService.submitFeedback(messageId, feedbackDto);
        return ResponseEntity.ok(ApiResponse.ok(null, "Ghi nhận đánh giá phản hồi thành công"));
    }

    // ── 2. QUẢN TRỊ KHO TRI THỨC (KNOWLEDGE BASE) ──

    @GetMapping("/knowledge-base/documents")
    @PreAuthorize("@perm.has('ai.knowledge_base.manage')")
    @RequirePermission("ai.knowledge_base.manage")
    @Operation(summary = "Danh sách tài liệu trong kho tri thức công ty")
    public ResponseEntity<ApiResponse<PageData<KnowledgeDocumentResponse>>> getKnowledgeDocuments(
            @Valid KnowledgeDocumentFilter filter) {
        PageData<KnowledgeDocumentResponse> result = assistantService.getKnowledgeDocuments(filter);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách tài liệu tri thức thành công"));
    }

    @PostMapping("/knowledge-base/documents")
    @PreAuthorize("@perm.has('ai.knowledge_base.manage')")
    @RequirePermission("ai.knowledge_base.manage")
    @Operation(summary = "Tải lên / Thêm mới tài liệu vào kho tri thức")
    public ResponseEntity<ApiResponse<KnowledgeDocumentResponse>> createKnowledgeDocument(
            @Valid @RequestBody CreateKnowledgeDocumentRequestDto dto) {
        KnowledgeDocumentResponse result = assistantService.createKnowledgeDocument(dto);
        return ResponseEntity.ok(ApiResponse.ok(result, "Thêm tài liệu tri thức thành công"));
    }

    @PutMapping("/knowledge-base/documents/{id}/archive")
    @PreAuthorize("@perm.has('ai.knowledge_base.manage')")
    @RequirePermission("ai.knowledge_base.manage")
    @Operation(summary = "Lưu trữ / Ngừng áp dụng tài liệu cũ")
    public ResponseEntity<ApiResponse<Void>> archiveKnowledgeDocument(@PathVariable UUID id) {
        assistantService.archiveKnowledgeDocument(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Lưu trữ tài liệu thành công"));
    }

    @DeleteMapping("/knowledge-base/documents/{id}")
    @PreAuthorize("@perm.has('ai.knowledge_base.manage')")
    @RequirePermission("ai.knowledge_base.manage")
    @Operation(summary = "Xóa tài liệu khỏi kho tri thức")
    public ResponseEntity<ApiResponse<Void>> deleteKnowledgeDocument(@PathVariable UUID id) {
        assistantService.deleteKnowledgeDocument(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Xóa tài liệu thành công"));
    }

    // ── 3. QUẢN TRỊ CÂU HỎI CHƯA CÓ LỜI GIẢI (KNOWLEDGE GAPS) ──

    @GetMapping("/unanswered-questions")
    @PreAuthorize("@perm.has('ai.knowledge_base.manage')")
    @RequirePermission("ai.knowledge_base.manage")
    @Operation(summary = "Danh sách câu hỏi chưa được giải đáp (phát hiện lỗ hổng tri thức)")
    public ResponseEntity<ApiResponse<PageData<UnansweredQuestionResponse>>> getUnansweredQuestions(
            @Valid UnansweredQuestionFilter filter) {
        PageData<UnansweredQuestionResponse> result = assistantService.getUnansweredQuestions(filter);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách câu hỏi chưa giải đáp thành công"));
    }

    @PutMapping("/unanswered-questions/{id}/resolve")
    @PreAuthorize("@perm.has('ai.knowledge_base.manage')")
    @RequirePermission("ai.knowledge_base.manage")
    @Operation(summary = "Đánh dấu đã giải quyết (đã bổ sung tài liệu mới)")
    public ResponseEntity<ApiResponse<Void>> resolveUnansweredQuestion(@PathVariable UUID id) {
        assistantService.resolveUnansweredQuestion(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Đã đánh dấu giải quyết câu hỏi thành công"));
    }

    @PutMapping("/unanswered-questions/{id}/dismiss")
    @PreAuthorize("@perm.has('ai.knowledge_base.manage')")
    @RequirePermission("ai.knowledge_base.manage")
    @Operation(summary = "Bỏ qua câu hỏi không phù hợp / câu hỏi rác")
    public ResponseEntity<ApiResponse<Void>> dismissUnansweredQuestion(@PathVariable UUID id) {
        assistantService.dismissUnansweredQuestion(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Đã bỏ qua câu hỏi"));
    }
}
