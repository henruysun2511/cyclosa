import type {
  KnowledgeCategory,
  KnowledgeDocumentStatus,
  UnansweredQuestionStatus,
} from "../types/ai.types";

export const KNOWLEDGE_CATEGORY_LABELS: Record<KnowledgeCategory, string> = {
  HR_POLICY: "Chính sách & Quy chế Nhân sự",
  EMPLOYEE_HANDBOOK: "Sổ tay Văn hóa Doanh nghiệp",
  SYSTEM_GUIDE: "Hướng dẫn Sử dụng Hệ thống",
  LEGAL_COMPLIANCE: "Quy định Pháp luật & Tuân thủ",
};

export const KNOWLEDGE_STATUS_LABELS: Record<KnowledgeDocumentStatus, string> = {
  ACTIVE: "Đang áp dụng",
  PROCESSING: "Đang lập vector",
  ARCHIVED: "Đã lưu trữ",
};

export const KNOWLEDGE_STATUS_COLORS: Record<
  KnowledgeDocumentStatus,
  { bg: string; text: string; border: string }
> = {
  ACTIVE: {
    bg: "bg-emerald-600",
    text: "text-white",
    border: "border-transparent",
  },
  PROCESSING: {
    bg: "bg-blue-600",
    text: "text-white",
    border: "border-transparent",
  },
  ARCHIVED: {
    bg: "bg-slate-600",
    text: "text-white",
    border: "border-transparent",
  },
};

export const UNANSWERED_STATUS_LABELS: Record<
  UnansweredQuestionStatus,
  string
> = {
  PENDING_REVIEW: "Chờ rà soát",
  DOCUMENT_ADDED: "Đã bổ sung tài liệu",
  DISMISSED: "Đã bỏ qua",
};

export const UNANSWERED_STATUS_COLORS: Record<
  UnansweredQuestionStatus,
  { bg: string; text: string; border: string }
> = {
  PENDING_REVIEW: {
    bg: "bg-amber-600",
    text: "text-white",
    border: "border-transparent",
  },
  DOCUMENT_ADDED: {
    bg: "bg-emerald-600",
    text: "text-white",
    border: "border-transparent",
  },
  DISMISSED: {
    bg: "bg-slate-600",
    text: "text-white",
    border: "border-transparent",
  },
};

export const PROMPT_SUGGESTIONS = [
  {
    icon: "CalendarCheck",
    label: "Ngày phép còn lại",
    query: "Tôi còn bao nhiêu ngày phép năm tính đến hiện tại?",
    role: "ALL",
  },
  {
    icon: "ReceiptText",
    label: "Tóm tắt phiếu lương",
    query: "Xem tóm tắt phiếu lương tháng gần nhất của tôi",
    role: "ALL",
  },
  {
    icon: "Clock",
    label: "Thống kê chấm công",
    query: "Thống kê tình hình đi làm muộn và số công tháng này của phòng tôi",
    role: "MANAGER",
  },
  {
    icon: "BookOpen",
    label: "Chính sách làm việc từ xa (WFH)",
    query: "Quy định về đăng ký làm việc từ xa (WFH) của công ty như thế nào?",
    role: "ALL",
  },
  {
    icon: "Users",
    label: "Cơ cấu định biên nhân sự",
    query: "Báo cáo cơ cấu định biên nhân sự theo phòng ban",
    role: "HR",
  },
  {
    icon: "ShieldAlert",
    label: "Quy chế xử lý vi phạm",
    query: "Các hình thức xử lý kỷ luật lao động theo quy định công ty",
    role: "ALL",
  },
];
