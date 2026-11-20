/**
 * CYCLOSA - Phân hệ 06: Hội nhập Nhân sự (Onboarding)
 * Hằng số danh mục, Nhãn tiếng Việt 100% & Cấu hình giao diện chuẩn CYCLOSA
 */

import {
  FileText,
  Laptop,
  KeyRound,
  GraduationCap,
  Users,
} from "lucide-react";
import type {
  OnboardingTaskGroup,
  OnboardingStatus,
  OnboardingTaskStatus,
  OrientationSessionStatus,
  ItAccountRequestStatus,
} from "../types/onboarding.types";

// ───────────────────────────────────────────────────────────
// 1. NHÓM CÔNG VIỆC HỘI NHẬP (5 TASK GROUPS)
// ───────────────────────────────────────────────────────────

export const ONBOARDING_TASK_GROUP = {
  DOCS: "DOCS",
  EQUIPMENT: "EQUIPMENT",
  ACCOUNTS: "ACCOUNTS",
  TRAINING: "TRAINING",
  ORIENTATION: "ORIENTATION",
} as const;

export const ONBOARDING_TASK_GROUP_LABELS: Record<OnboardingTaskGroup, string> = {
  DOCS: "Hồ sơ & Giấy tờ",
  EQUIPMENT: "Trang thiết bị",
  ACCOUNTS: "Tài khoản CNTT",
  TRAINING: "Đào tạo chuyên môn",
  ORIENTATION: "Văn hóa & Định hướng",
};

export const ONBOARDING_TASK_GROUP_DESCRIPTIONS: Record<OnboardingTaskGroup, string> = {
  DOCS: "Hồ sơ nhân sự, bản sao CCCD, bằng cấp, ký kết hợp đồng lao động và cam kết bảo mật NDA.",
  EQUIPMENT: "Bàn giao máy tính xách tay, màn hình phụ, thẻ nhân viên và chỗ ngồi làm việc.",
  ACCOUNTS: "Khởi tạo và cấp quyền Email công ty, Slack, Jira, GitHub và các hệ thống nội bộ.",
  TRAINING: "Tài liệu kỹ thuật dự án, quy trình vận hành và kiểm tra kiến thức chuyên môn.",
  ORIENTATION: "Gặp gỡ ban lãnh đạo, giao lưu người hướng dẫn (Buddy) và học văn hóa doanh nghiệp.",
};

export const ONBOARDING_TASK_GROUP_ICONS: Record<OnboardingTaskGroup, typeof FileText> = {
  DOCS: FileText,
  EQUIPMENT: Laptop,
  ACCOUNTS: KeyRound,
  TRAINING: GraduationCap,
  ORIENTATION: Users,
};

export const ONBOARDING_TASK_GROUP_OPTIONS = [
  { value: "DOCS", label: "Hồ sơ & Giấy tờ (DOCS)" },
  { value: "EQUIPMENT", label: "Trang thiết bị (EQUIPMENT)" },
  { value: "ACCOUNTS", label: "Tài khoản CNTT (ACCOUNTS)" },
  { value: "TRAINING", label: "Đào tạo chuyên môn (TRAINING)" },
  { value: "ORIENTATION", label: "Văn hóa & Định hướng (ORIENTATION)" },
];

// ───────────────────────────────────────────────────────────
// 2. TRẠNG THÁI TIẾN TRÌNH HỘI NHẬP (PROCESS STATUS)
// ───────────────────────────────────────────────────────────

export const ONBOARDING_STATUS = {
  PREPARING: "PREPARING",
  IN_PROGRESS: "IN_PROGRESS",
  REVIEW_PENDING: "REVIEW_PENDING",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

export const ONBOARDING_STATUS_LABELS: Record<OnboardingStatus, string> = {
  PREPARING: "Chuẩn bị tiếp nhận",
  IN_PROGRESS: "Đang hội nhập",
  REVIEW_PENDING: "Chờ nghiệm thu",
  COMPLETED: "Đã hoàn thành",
  CANCELLED: "Đã hủy bỏ",
};

export const ONBOARDING_STATUS_COLORS: Record<
  OnboardingStatus,
  { bg: string; text: string; border: string }
> = {
  PREPARING: {
    bg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-800",
  },
  IN_PROGRESS: {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-200 dark:border-amber-800",
  },
  REVIEW_PENDING: {
    bg: "bg-purple-50 dark:bg-purple-950/40",
    text: "text-purple-700 dark:text-purple-300",
    border: "border-purple-200 dark:border-purple-800",
  },
  COMPLETED: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-800",
  },
  CANCELLED: {
    bg: "bg-rose-50 dark:bg-rose-950/40",
    text: "text-rose-700 dark:text-rose-300",
    border: "border-rose-200 dark:border-rose-800",
  },
};

export const ONBOARDING_STATUS_OPTIONS = [
  { value: "ALL", label: "Tất cả trạng thái" },
  { value: "PREPARING", label: "Chuẩn bị tiếp nhận" },
  { value: "IN_PROGRESS", label: "Đang hội nhập" },
  { value: "REVIEW_PENDING", label: "Chờ nghiệm thu" },
  { value: "COMPLETED", label: "Đã hoàn thành" },
  { value: "CANCELLED", label: "Đã hủy bỏ" },
];

// ───────────────────────────────────────────────────────────
// 3. TRẠNG THÁI ĐẦU VIỆC (TASK STATUS)
// ───────────────────────────────────────────────────────────

export const ONBOARDING_TASK_STATUS_LABELS: Record<OnboardingTaskStatus, string> = {
  PENDING: "Chờ thực hiện",
  IN_PROGRESS: "Đang xử lý",
  COMPLETED: "Đã hoàn thành",
  SKIPPED: "Đã bỏ qua",
  CANCELLED: "Đã hủy",
};

export const ONBOARDING_TASK_STATUS_COLORS: Record<
  OnboardingTaskStatus,
  { bg: string; text: string; border: string }
> = {
  PENDING: {
    bg: "bg-slate-100 dark:bg-slate-800",
    text: "text-slate-700 dark:text-slate-300",
    border: "border-slate-200 dark:border-slate-700",
  },
  IN_PROGRESS: {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-200 dark:border-amber-800",
  },
  COMPLETED: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-800",
  },
  SKIPPED: {
    bg: "bg-zinc-100 dark:bg-zinc-800",
    text: "text-zinc-500 dark:text-zinc-400",
    border: "border-zinc-200 dark:border-zinc-700",
  },
  CANCELLED: {
    bg: "bg-rose-50 dark:bg-rose-950/40",
    text: "text-rose-700 dark:text-rose-300",
    border: "border-rose-200 dark:border-rose-800",
  },
};

// ───────────────────────────────────────────────────────────
// 4. TRẠNG THÁI YÊU CẦU IT & BUỔI ĐÀO TẠO
// ───────────────────────────────────────────────────────────

export const IT_REQUEST_STATUS_LABELS: Record<ItAccountRequestStatus, string> = {
  PENDING: "Chờ IT cấp phát",
  PROVISIONED: "Đã cấp tài khoản",
  FAILED: "Cấp thất bại / Từ chối",
  CANCELLED: "Đã hủy yêu cầu",
};

export const IT_REQUEST_STATUS_OPTIONS = [
  { value: "ALL", label: "Tất cả yêu cầu" },
  { value: "PENDING", label: "Chờ IT cấp phát" },
  { value: "PROVISIONED", label: "Đã cấp tài khoản" },
  { value: "FAILED", label: "Cấp thất bại / Từ chối" },
  { value: "CANCELLED", label: "Đã hủy yêu cầu" },
];

export const ORIENTATION_SESSION_STATUS_LABELS: Record<
  OrientationSessionStatus,
  string
> = {
  SCHEDULED: "Đã lên lịch",
  COMPLETED: "Đã hoàn thành",
  CANCELLED: "Đã hủy lớp",
};

export const ORIENTATION_SESSION_STATUS_OPTIONS = [
  { value: "ALL", label: "Tất cả các lớp" },
  { value: "SCHEDULED", label: "Đã lên lịch" },
  { value: "COMPLETED", label: "Đã hoàn thành" },
  { value: "CANCELLED", label: "Đã hủy lớp" },
];

// ───────────────────────────────────────────────────────────
// 5. VAI TRÒ MẶC ĐỊNH PHỤ TRÁCH (ASSIGNEE ROLES)
// ───────────────────────────────────────────────────────────

export const ASSIGNEE_ROLE_OPTIONS = [
  { value: "HR", label: "Bộ phận Nhân sự (HR)" },
  { value: "IT", label: "Bộ phận Công nghệ & IT Helpdesk" },
  { value: "DIRECT_MANAGER", label: "Quản lý trực tiếp (Manager)" },
  { value: "MENTOR", label: "Người hướng dẫn (Buddy / Mentor)" },
  { value: "EMPLOYEE", label: "Nhân viên mới tự thực hiện" },
];

