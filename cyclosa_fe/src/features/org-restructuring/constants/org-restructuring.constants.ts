import type {
  ScenarioStatus,
  ScenarioScope,
  DepartmentScenarioStatus,
  AssignmentStatus,
  ConflictSeverity,
} from "../types/org-restructuring.types";

export const SCENARIO_STATUS_CONFIG: Record<
  ScenarioStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; className?: string }
> = {
  DRAFT: {
    label: "Bản nháp",
    variant: "secondary",
    className: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
  ANALYZING: {
    label: "Đang phân tích",
    variant: "outline",
    className: "border-sky-500/30 text-sky-600 bg-sky-50/50 dark:bg-sky-950/30",
  },
  SUBMITTED: {
    label: "Chờ phê duyệt",
    variant: "outline",
    className: "border-amber-500/30 text-amber-600 bg-amber-50/50 dark:bg-amber-950/30",
  },
  APPROVED: {
    label: "Đã phê duyệt",
    variant: "outline",
    className: "border-emerald-500/30 text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30",
  },
  REJECTED: {
    label: "Bị từ chối",
    variant: "destructive",
  },
  EXECUTED: {
    label: "Đã áp dụng thực tế",
    variant: "default",
    className: "bg-emerald-600 hover:bg-emerald-600 text-white",
  },
  CANCELLED: {
    label: "Đã hủy bỏ",
    variant: "outline",
    className: "text-muted-foreground",
  },
};

export const SCENARIO_SCOPE_CONFIG: Record<ScenarioScope, { label: string }> = {
  COMPANY_WIDE: { label: "Toàn công ty" },
  DIVISION_LEVEL: { label: "Cấp Khối / Ban" },
  DEPARTMENT_LEVEL: { label: "Cấp Phòng ban" },
};

export const DEPT_SCENARIO_STATUS_CONFIG: Record<
  DepartmentScenarioStatus,
  { label: string; badgeClass: string; nodeClass: string }
> = {
  UNCHANGED: {
    label: "Giữ nguyên",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-300",
    nodeClass: "border-border/80 bg-card",
  },
  ADDED: {
    label: "Thành lập mới",
    badgeClass: "bg-emerald-100 text-emerald-700 border-emerald-300",
    nodeClass: "border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20",
  },
  MODIFIED: {
    label: "Có điều chỉnh",
    badgeClass: "bg-amber-100 text-amber-700 border-amber-300",
    nodeClass: "border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/20",
  },
  MERGED: {
    label: "Đã sáp nhập",
    badgeClass: "bg-purple-100 text-purple-700 border-purple-300",
    nodeClass: "border-purple-400 opacity-60 bg-purple-50/20",
  },
  SPLIT: {
    label: "Đã chia tách",
    badgeClass: "bg-blue-100 text-blue-700 border-blue-300",
    nodeClass: "border-blue-400 opacity-60 bg-blue-50/20",
  },
  DISSOLVED: {
    label: "Giải thể",
    badgeClass: "bg-rose-100 text-rose-700 border-rose-300",
    nodeClass: "border-rose-400 opacity-50 bg-rose-50/20 line-through",
  },
};

export const ASSIGNMENT_STATUS_CONFIG: Record<
  AssignmentStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  UNCHANGED: { label: "Giữ nguyên", variant: "secondary" },
  TRANSFERRED: { label: "Điều chuyển", variant: "default" },
  PROMOTED: { label: "Bổ nhiệm / Thăng chức", variant: "outline" },
  REDUNDANT: { label: "Tinh giản", variant: "destructive" },
};

export const CONFLICT_SEVERITY_CONFIG: Record<
  ConflictSeverity,
  { label: string; color: string; badgeClass: string }
> = {
  CRITICAL: {
    label: "Nghiêm trọng (Chặn đệ trình)",
    color: "text-rose-600",
    badgeClass: "bg-rose-100 text-rose-700 border-rose-300",
  },
  WARNING: {
    label: "Cảnh báo cần lưu ý",
    color: "text-amber-600",
    badgeClass: "bg-amber-100 text-amber-700 border-amber-300",
  },
  INFO: {
    label: "Thông tin tham khảo",
    color: "text-sky-600",
    badgeClass: "bg-sky-100 text-sky-700 border-sky-300",
  },
};
