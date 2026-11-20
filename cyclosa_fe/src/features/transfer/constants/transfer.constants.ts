import type { TransferReason, TransferStatus, TransferType } from "../types/transfer.types";

export const TRANSFER_TYPE_LABELS: Record<TransferType, string> = {
  INTERNAL_DEPARTMENT: "Nội bộ phòng ban",
  BRANCH_TRANSFER: "Điều chuyển chi nhánh",
  INTER_COMPANY: "Công ty thành viên",
  ROLE_PROMOTION_DEMOTION: "Bổ nhiệm / Đổi chức vụ",
  TEMPORARY_DISPATCH: "Điều chuyển tạm thời / Biệt phái",
};

export const TRANSFER_TYPE_VARIANTS: Record<
  TransferType,
  { label: string; className: string }
> = {
  INTERNAL_DEPARTMENT: {
    label: "Nội bộ phòng ban",
    className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
  },
  BRANCH_TRANSFER: {
    label: "Khác chi nhánh",
    className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
  },
  INTER_COMPANY: {
    label: "Công ty thành viên",
    className: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800",
  },
  ROLE_PROMOTION_DEMOTION: {
    label: "Bổ nhiệm / Thay đổi chức vụ",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
  },
  TEMPORARY_DISPATCH: {
    label: "Tạm thời / Biệt phái",
    className: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800",
  },
};

export const TRANSFER_STATUS_VARIANTS: Record<
  TransferStatus,
  { label: string; className: string }
> = {
  DRAFT: {
    label: "Dự thảo",
    className: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300",
  },
  SUBMITTED: {
    label: "Đã nộp",
    className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300",
  },
  PENDING_APPROVAL: {
    label: "Chờ phê duyệt",
    className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300",
  },
  APPROVED: {
    label: "Đã phê duyệt",
    className: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300",
  },
  COMPLETED: {
    label: "Đã áp dụng",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300",
  },
  REJECTED: {
    label: "Từ chối",
    className: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300",
  },
  CANCELLED: {
    label: "Đã hủy",
    className: "bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400",
  },
};

export const TRANSFER_REASON_OPTIONS: { value: TransferReason; label: string }[] = [
  { value: "BUSINESS_NEED", label: "Yêu cầu sản xuất kinh doanh" },
  { value: "PROMOTION", label: "Thăng chức / Bổ nhiệm" },
  { value: "CAREER_DEVELOPMENT", label: "Phát triển năng lực & luân chuyển cán bộ" },
  { value: "PERFORMANCE", label: "Kết quả đánh giá hiệu suất" },
  { value: "RESTRUCTURING", label: "Tái cơ cấu tổ chức" },
  { value: "EMPLOYEE_REQUEST", label: "Nguyện vọng cá nhân của nhân sự" },
  { value: "TEMPORARY_PROJECT", label: "Dự án đặc thù ngắn hạn" },
  { value: "OTHER", label: "Lý do khác" },
];
