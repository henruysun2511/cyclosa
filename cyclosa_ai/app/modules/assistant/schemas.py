from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from app.common.schemas.response import ApiResponse


class ChatMessage(BaseModel):
    role: str = Field(..., description="'user', 'assistant', hoặc 'system'")
    content: str = Field(..., description="Nội dung tin nhắn")
    timestamp: Optional[str] = Field(None, description="Thời điểm gửi ISO-8601")


class UserContext(BaseModel):
    user_id: str = Field(..., description="ID tài khoản đăng nhập")
    employee_id: Optional[str] = Field(None, description="ID nhân viên tương ứng")
    full_name: str = Field("Nhân viên CYCLOSA", description="Họ và tên người dùng")
    department_id: Optional[str] = Field(None, description="ID phòng ban hiện tại")
    department_name: Optional[str] = Field("Khối Kỹ thuật", description="Tên phòng ban")
    job_title: Optional[str] = Field("Nhân viên", description="Chức danh công việc")
    roles: List[str] = Field(default_factory=lambda: ["ROLE_EMPLOYEE"], description="Danh sách vai trò RBAC")
    company_id: Optional[str] = Field("cyclosa-corp", description="ID công ty")


class ChatRequest(BaseModel):
    query: str = Field(..., description="Câu hỏi hoặc yêu cầu của người dùng")
    user_context: UserContext = Field(..., description="Ngữ cảnh người dùng hiện tại (RBAC, DataScope)")
    conversation_history: Optional[List[ChatMessage]] = Field(default_factory=list, description="Lịch sử hội thoại trước đó")


class Citation(BaseModel):
    document_title: str = Field(..., description="Tên văn bản hoặc quy chế nội bộ")
    section: str = Field(..., description="Điều khoản hoặc mục trích dẫn")
    content_snippet: str = Field(..., description="Đoạn trích dẫn nội dung căn cứ")


class ChatResponseData(BaseModel):
    response: str = Field(..., description="Câu trả lời của trợ lý AI")
    intent: str = Field(..., description="in_scope_data | in_scope_policy | out_of_scope")
    function_called: Optional[str] = Field(None, description="Tên hàm nghiệp vụ đã gọi nếu có")
    function_args: Optional[Dict[str, Any]] = Field(None, description="Tham số hàm đã truyền")
    citations: List[Citation] = Field(default_factory=list, description="Danh sách tài liệu/quy chế trích dẫn (nếu tra cứu chính sách)")
    disclaimer: str = Field(
        "Lưu ý: CYCLOSA AI là trợ lý hỗ trợ tra cứu thông tin. Các quyết định nhân sự và phê duyệt chính thức thuộc thẩm quyền của cấp quản lý và phòng Nhân sự.",
        description="Miễn trừ trách nhiệm theo quy định AI"
    )
    execution_time_ms: int = Field(0, description="Thời gian xử lý tính theo milliseconds")


class ChatResponse(ApiResponse[ChatResponseData]):
    pass


class IntentClassificationResult(BaseModel):
    intent: str = Field(..., description="in_scope_data | in_scope_policy | out_of_scope")
    confidence: float = Field(..., description="Độ chắc chắn 0.0 -> 1.0")
    reasoning: str = Field(..., description="Lý do phân loại")
    target_function: Optional[str] = Field(None, description="Hàm nghiệp vụ tương ứng nếu là in_scope_data")


class IntentClassificationResponse(ApiResponse[IntentClassificationResult]):
    pass
