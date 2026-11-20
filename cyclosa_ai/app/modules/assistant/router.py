from fastapi import APIRouter, Depends
from app.core.security import verify_internal_api_key
from app.modules.assistant.schemas import (
    ChatRequest, ChatResponse,
    IntentClassificationResponse
)
from app.modules.assistant.service import AssistantAiService

router = APIRouter(
    prefix="/assistant",
    tags=["AI 1-1 Chatbot Assistant (Module 18)"],
    dependencies=[Depends(verify_internal_api_key)]
)


@router.post(
    "/chat",
    response_model=ChatResponse,
    summary="Hội thoại 1-1 với Trợ lý AI Nhân sự",
    description="Quy trình 3 bước: Intent Guard -> Function Calling với RBAC & DataScope -> RAG Knowledge Base với Citations."
)
def chat_with_assistant(request: ChatRequest):
    result = AssistantAiService.process_chat(request)
    return ChatResponse.ok(
        data=result,
        message="Trợ lý AI đã xử lý hội thoại thành công"
    )


@router.post(
    "/classify-intent",
    response_model=IntentClassificationResponse,
    summary="Phân loại ý định người dùng (Intent Guard Check)",
    description="Kiểm tra xem câu hỏi có thuộc phạm vi HRM (in_scope_data, in_scope_policy) hay ngoài phạm vi (out_of_scope)."
)
def classify_user_intent(query: str):
    result = AssistantAiService.classify_intent(query)
    return IntentClassificationResponse.ok(
        data=result,
        message="Phân loại intent thành công"
    )
