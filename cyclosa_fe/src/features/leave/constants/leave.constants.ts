import type {
  LeaveGroup,
  LeavePayer,
  DayPortion,
  LeaveRequestStatus,
  ContractType,
} from "../types/leave.types";

// ── Vietnamese Labels ────────────────────────────────────────────────────────

export const LEAVE_GROUP_LABELS: Record<LeaveGroup, string> = {
  ANNUAL: "Nghỉ phép năm",
  PUBLIC_HOLIDAY: "Nghỉ lễ / Tết",
  PERSONAL_PAID: "Việc riêng có lương",
  PERSONAL_UNPAID: "Việc riêng không lương",
  SICK: "Ốm đau (BHXH)",
  MATERNITY: "Thai sản (BHXH)",
};

export const LEAVE_PAYER_LABELS: Record<LeavePayer, string> = {
  EMPLOYER: "Doanh nghiệp trả lương",
  SOCIAL_INSURANCE: "Bảo hiểm xã hội",
  NONE: "Không hưởng lương",
};

export const DAY_PORTION_LABELS: Record<DayPortion, string> = {
  FULL_DAY: "Nguyên ngày (1.0 ngày)",
  MORNING: "Buổi sáng (0.5 ngày)",
  AFTERNOON: "Buổi chiều (0.5 ngày)",
};

export const LEAVE_STATUS_LABELS: Record<LeaveRequestStatus, string> = {
  DRAFT: "Bản nháp",
  PENDING_APPROVAL: "Chờ phê duyệt",
  APPROVED: "Đã phê duyệt",
  REJECTED: "Từ chối",
  CANCELLED: "Đã hủy",
};

export const CONTRACT_TYPE_LABELS: Record<ContractType, string> = {
  FIXED_TERM: "Xác định thời hạn",
  INDEFINITE: "Không xác định thời hạn",
  PROBATION: "Thử việc",
  SERVICE: "Hợp đồng dịch vụ / Khoán",
};

// ── Badge Variants & Colors ──────────────────────────────────────────────────

export const LEAVE_STATUS_VARIANTS: Record<
  LeaveRequestStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; className: string }
> = {
  DRAFT: {
    label: "Bản nháp",
    variant: "secondary",
    className: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200",
  },
  PENDING_APPROVAL: {
    label: "Chờ phê duyệt",
    variant: "outline",
    className: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-300",
  },
  APPROVED: {
    label: "Đã phê duyệt",
    variant: "default",
    className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-300",
  },
  REJECTED: {
    label: "Từ chối",
    variant: "destructive",
    className: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-300",
  },
  CANCELLED: {
    label: "Đã hủy",
    variant: "secondary",
    className: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 border-gray-200 line-through",
  },
};

export const LEAVE_GROUP_VARIANTS: Record<
  LeaveGroup,
  { label: string; className: string }
> = {
  ANNUAL: {
    label: "Nghỉ phép năm",
    className: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200",
  },
  PUBLIC_HOLIDAY: {
    label: "Nghỉ lễ / Tết",
    className: "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200",
  },
  PERSONAL_PAID: {
    label: "Việc riêng có lương",
    className: "bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 border-teal-200",
  },
  PERSONAL_UNPAID: {
    label: "Việc riêng không lương",
    className: "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300 border-orange-200",
  },
  SICK: {
    label: "Ốm đau (BHXH)",
    className: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200",
  },
  MATERNITY: {
    label: "Thai sản (BHXH)",
    className: "bg-pink-50 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300 border-pink-200",
  },
};

export const LEAVE_PAYER_VARIANTS: Record<
  LeavePayer,
  { label: string; className: string }
> = {
  EMPLOYER: {
    label: "Doanh nghiệp trả lương",
    className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200",
  },
  SOCIAL_INSURANCE: {
    label: "Bảo hiểm xã hội chi trả",
    className: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-200",
  },
  NONE: {
    label: "Không hưởng lương",
    className: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200",
  },
};

// ── Dropdown Select Options (100% Vietnamese) ────────────────────────────────

export const LEAVE_GROUP_OPTIONS: { label: string; value: LeaveGroup | "ALL" }[] = [
  { label: "Tất cả nhóm nghỉ", value: "ALL" },
  { label: "Nghỉ phép năm", value: "ANNUAL" },
  { label: "Nghỉ lễ / Tết", value: "PUBLIC_HOLIDAY" },
  { label: "Việc riêng có lương", value: "PERSONAL_PAID" },
  { label: "Việc riêng không lương", value: "PERSONAL_UNPAID" },
  { label: "Ốm đau (BHXH)", value: "SICK" },
  { label: "Thai sản (BHXH)", value: "MATERNITY" },
];

export const LEAVE_PAYER_OPTIONS: { label: string; value: LeavePayer | "ALL" }[] = [
  { label: "Tất cả nguồn chi trả", value: "ALL" },
  { label: "Doanh nghiệp trả lương", value: "EMPLOYER" },
  { label: "Bảo hiểm xã hội chi trả", value: "SOCIAL_INSURANCE" },
  { label: "Không hưởng lương", value: "NONE" },
];

export const DAY_PORTION_OPTIONS: { label: string; value: DayPortion }[] = [
  { label: "Nguyên ngày (1.0 ngày)", value: "FULL_DAY" },
  { label: "Buổi sáng (0.5 ngày)", value: "MORNING" },
  { label: "Buổi chiều (0.5 ngày)", value: "AFTERNOON" },
];

export const LEAVE_STATUS_OPTIONS: { label: string; value: LeaveRequestStatus | "ALL" }[] = [
  { label: "Tất cả trạng thái", value: "ALL" },
  { label: "Chờ phê duyệt", value: "PENDING_APPROVAL" },
  { label: "Đã phê duyệt", value: "APPROVED" },
  { label: "Từ chối", value: "REJECTED" },
  { label: "Đã hủy", value: "CANCELLED" },
  { label: "Bản nháp", value: "DRAFT" },
];

export const CONTRACT_TYPE_OPTIONS: { label: string; value: ContractType | "ALL" }[] = [
  { label: "Tất cả loại hợp đồng", value: "ALL" },
  { label: "Xác định thời hạn", value: "FIXED_TERM" },
  { label: "Không xác định thời hạn", value: "INDEFINITE" },
  { label: "Thử việc", value: "PROBATION" },
  { label: "Hợp đồng dịch vụ / Khoán", value: "SERVICE" },
];

