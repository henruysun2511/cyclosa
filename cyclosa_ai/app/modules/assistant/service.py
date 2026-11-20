import time
import logging
from typing import Dict, Any, List, Optional
from app.modules.assistant.schemas import (
    ChatRequest, ChatResponseData,
    IntentClassificationResult, Citation
)
from app.modules.assistant.intent_guard import IntentGuard
from app.modules.assistant.function_registry import FunctionRegistry
from app.modules.assistant.rag_service import RagKnowledgeBase
from app.modules.assistant.prompts import (
    ASSISTANT_SYSTEM_PROMPT,
    OUT_OF_SCOPE_RESPONSE
)
from app.common.llm.client import LlmClient

logger = logging.getLogger("cyclosa_ai.assistant")


class AssistantAiService:
    """
    Dịch vụ điều phối AI 1-1 Chatbot Assistant (Module 18)
    Thực thi quy trình 3 bước chuẩn mực:
    1. Intent Guard & Chống tấn công injection.
    2. Function Calling với kiểm tra RBAC & DataScope.
    3. RAG Knowledge Base với tìm kiếm ngữ nghĩa và trích dẫn văn bản quy chế.
    """

    @classmethod
    def process_chat(cls, request: ChatRequest) -> ChatResponseData:
        start_time = time.time()
        query = request.query.strip()
        user = request.user_context

        # ==========================================
        # BƯỚC 1: INTENT GUARD & SAFETY CHECK
        # ==========================================
        intent_res = IntentGuard.classify(query)
        intent = intent_res.intent

        # Trường hợp 1: Ngoài phạm vi hỗ trợ hoặc phát hiện vi phạm
        if intent == "out_of_scope":
            exec_time = int((time.time() - start_time) * 1000)
            return ChatResponseData(
                response=OUT_OF_SCOPE_RESPONSE.strip(),
                intent="out_of_scope",
                function_called=None,
                function_args=None,
                citations=[],
                execution_time_ms=exec_time
            )

        # ==========================================
        # BƯỚC 2: FUNCTION CALLING (IN_SCOPE_DATA)
        # ==========================================
        if intent == "in_scope_data" and intent_res.target_function:
            func_name = intent_res.target_function
            success, answer_text, data = FunctionRegistry.execute(
                function_name=func_name,
                user_context=user,
                query=query
            )

            exec_time = int((time.time() - start_time) * 1000)
            return ChatResponseData(
                response=answer_text,
                intent="in_scope_data",
                function_called=func_name,
                function_args={"employee_id": user.employee_id, "roles": user.roles},
                citations=[],
                execution_time_ms=exec_time
            )

        # ==========================================
        # BƯỚC 3: RAG KNOWLEDGE BASE (IN_SCOPE_POLICY)
        # ==========================================
        citations = RagKnowledgeBase.get_citations(query, top_k=2)

        if citations:
            # Xây dựng ngữ cảnh RAG từ các tài liệu tìm thấy
            context_snippets = []
            for c in citations:
                context_snippets.append(f"[{c.document_title} - {c.section}]\n{c.content_snippet}")
            rag_context = "\n\n".join(context_snippets)

            # Tổng hợp câu trả lời
            user_prompt = (
                f"Người dùng '{user.full_name}' hỏi: {query}\n\n"
                f"Căn cứ vào tài liệu quy chế nội bộ sau đây:\n{rag_context}\n\n"
                f"Hãy trả lời người dùng một cách rõ ràng, chính xác, viện dẫn tên văn bản và điều khoản."
            )

            try:
                # Thử gọi LLM sinh văn phong tự nhiên nếu có cấu hình
                from pydantic import BaseModel, Field

                class PolicyAnswer(BaseModel):
                    answer: str = Field(..., description="Câu trả lời giải thích chi tiết và trích dẫn quy chế")

                llm_res = LlmClient.generate_structured(
                    response_model=PolicyAnswer,
                    system_prompt=ASSISTANT_SYSTEM_PROMPT,
                    user_prompt=user_prompt
                )
                final_response = llm_res.answer
            except Exception:
                # Fallback định dạng chuẩn dựa trên văn bản trích dẫn
                top_doc = citations[0]
                final_response = (
                    f"Theo **{top_doc.document_title}** ({top_doc.section}):\n\n"
                    f"{top_doc.content_snippet}\n\n"
                    f"Nếu anh/chị cần hỗ trợ thêm về trường hợp cụ thể của mình, vui lòng gửi yêu cầu trên hệ thống CYCLOSA hoặc liên hệ trực tiếp phòng Nhân sự."
                )
        else:
            final_response = (
                f"Xin chào {user.full_name}, tôi đã tiếp nhận câu hỏi của bạn về: *\"{query}\"*.\n\n"
                f"Tuy nhiên, hiện tại tôi chưa tìm thấy điều khoản hoặc quy chế cụ thể tương ứng trong kho tri thức nội bộ. "
                f"Bạn có thể tra cứu thêm tại mục *Tủ tài liệu số hóa quy chế* hoặc liên hệ chuyên viên Nhân sự để được giải đáp chi tiết nhất."
            )

        exec_time = int((time.time() - start_time) * 1000)
        return ChatResponseData(
            response=final_response,
            intent="in_scope_policy",
            function_called=None,
            function_args=None,
            citations=citations,
            execution_time_ms=exec_time
        )

    @classmethod
    def classify_intent(cls, query: str) -> IntentClassificationResult:
        """Kiểm tra và phân loại intent độc lập"""
        return IntentGuard.classify(query)
