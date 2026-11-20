import re
from typing import Tuple, Optional
from app.modules.assistant.schemas import IntentClassificationResult


class IntentGuard:
    """
    Tầng phòng thủ kiểm soát ý định và phát hiện tấn công (Prompt Injection, Jailbreak, Out-of-scope).
    Tuân thủ nguyên tắc:
    - Bất kỳ câu hỏi nào ngoài phạm vi HRM sẽ bị chặn lịch sự.
    - Phát hiện ý đồ vượt quyền hoặc thao túng prompt (Jailbreak).
    """

    # Danh sách các mẫu tấn công Prompt Injection / Jailbreak
    INJECTION_PATTERNS = [
        r'ignore (?:all )?(?:previous|above) instructions',
        r'bỏ qua (?:mọi |tất cả )?(?:hướng dẫn|chỉ thị|lệnh) trước',
        r'quên (?:hết |tất cả )?lệnh',
        r'act as (?:dan|unrestricted|god mode)',
        r'đóng vai (?:hacker|kẻ tấn công)',
        r'(?:drop|delete|truncate|alter)\s+table',
        r'show (?:system|hidden) prompt',
        r'tiết lộ (?:system prompt|mật khẩu|database)',
        r'system override',
    ]

    # Các từ khóa tra cứu dữ liệu thời gian thực (in_scope_data)
    DATA_PATTERNS = {
        "get_my_leave_balance": [r'phép năm', r'ngày phép', r'còn bao nhiêu ngày nghỉ', r'nghỉ phép còn lại', r'số ngày phép'],
        "get_my_attendance_summary": [r'chấm công', r'đi muộn', r'về sớm', r'công tháng', r'bảng công', r'quẹt thẻ'],
        "get_my_payslip_overview": [r'lương tháng', r'phiếu lương', r'thu nhập', r'lương net', r'lương gross', r'tiền lương'],
        "get_team_leave_status": [r'ai nghỉ hôm nay', r'danh sách nghỉ', r'nhân sự nghỉ', r'team nghỉ', r'nghỉ phép trong phòng'],
        "get_headcount_by_department": [r'quân số', r'định biên', r'số lượng nhân sự', r'bao nhiêu nhân viên', r'tổng số người trong phòng'],
        "get_recruitment_pipeline_status": [r'tuyển dụng', r'ứng viên', r'tiến độ tuyển', r'vị trí đang tuyển', r'phỏng vấn'],
        "get_company_holidays": [r'lịch nghỉ lễ', r'nghỉ lễ', r'tết', r'nghỉ tết', r'nghỉ 30/4', r'nghỉ quốc khánh'],
        "get_pending_approvals_count": [r'chờ duyệt', r'đơn cần duyệt', r'yêu cầu chờ duyệt', r'duyệt đơn']
    }

    # Các từ khóa hỏi về quy chế / chính sách nội bộ (in_scope_policy)
    POLICY_KEYWORDS = [
        "quy chế", "chính sách", "nội quy", "quy định", "thông tư", "luật lao động",
        "thai sản", "ốm đau", "bảo hiểm", "bhxh", "thử việc", "hợp đồng", "thưởng",
        "phúc lợi", "làm việc từ xa", "remote", "hybrid", "trang phục", "giờ làm việc",
        "nghỉ không lương", "nghỉ kết hôn", "nghỉ ma chay", "thâm niên", "lưu trữ", "số hóa"
    ]

    @classmethod
    def classify(cls, query: str) -> IntentClassificationResult:
        """
        Phân loại câu hỏi vào 1 trong 3 nhóm:
        1. in_scope_data: Yêu cầu truy vấn dữ liệu nghiệp vụ của cá nhân hoặc phòng ban.
        2. in_scope_policy: Yêu cầu giải đáp quy chế, chính sách công ty hoặc pháp luật lao động.
        3. out_of_scope: Câu hỏi ngoài phạm vi, linh tinh, hoặc vi phạm an toàn.
        """
        cleaned_query = query.strip().lower()

        # 1. Kiểm tra an toàn Prompt Injection & Jailbreak
        for pattern in cls.INJECTION_PATTERNS:
            if re.search(pattern, cleaned_query):
                return IntentClassificationResult(
                    intent="out_of_scope",
                    confidence=1.0,
                    reasoning="Phát hiện mẫu câu thao túng prompt hoặc yêu cầu vượt phạm vi an toàn.",
                    target_function=None
                )

        # 2. Kiểm tra câu hỏi tra cứu dữ liệu (in_scope_data)
        for func_name, patterns in cls.DATA_PATTERNS.items():
            for p in patterns:
                if re.search(p, cleaned_query):
                    return IntentClassificationResult(
                        intent="in_scope_data",
                        confidence=0.95,
                        reasoning=f"Yêu cầu tra cứu dữ liệu nhân sự tương ứng với hàm {func_name}.",
                        target_function=func_name
                    )

        # 3. Kiểm tra câu hỏi chính sách / quy chế (in_scope_policy)
        for keyword in cls.POLICY_KEYWORDS:
            if keyword in cleaned_query:
                return IntentClassificationResult(
                    intent="in_scope_policy",
                    confidence=0.90,
                    reasoning=f"Truy vấn chính sách quy chế nội bộ liên quan đến từ khóa '{keyword}'.",
                    target_function=None
                )

        # 4. Kiểm tra các câu chào hỏi lịch sự ngắn
        greetings = ["xin chào", "chào bạn", "hello", "hi", "bạn là ai", "hỗ trợ tôi"]
        if any(g in cleaned_query for g in greetings) and len(cleaned_query) < 25:
            return IntentClassificationResult(
                intent="in_scope_policy",
                confidence=0.85,
                reasoning="Lời chào hỏi ban đầu, cung cấp giới thiệu khả năng hỗ trợ của CYCLOSA AI.",
                target_function=None
            )

        # 5. Mặc định: Ngoài phạm vi HRM
        return IntentClassificationResult(
            intent="out_of_scope",
            confidence=0.80,
            reasoning="Câu hỏi không thuộc nghiệp vụ quản lý nhân sự, chấm công, tiền lương hoặc chính sách nội bộ CYCLOSA.",
            target_function=None
        )
