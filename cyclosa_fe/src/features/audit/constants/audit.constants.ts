// ============================================================================
// HẰNG SỐ PHÂN HỆ NHẬT KÝ KIỂM TOÁN & TRUY VẾT (MOD-19)
// ============================================================================

import type { AuditAction } from "../types/audit.types";

/**
 * Cấu hình hiển thị cho 13 Hành động kiểm toán chuẩn hóa.
 * - label: Nhãn tiếng Việt hiển thị trên UI
 * - className: Tailwind CSS classes cho Badge
 * - badgeVariant: Tên variant trả về từ Backend (phục vụ filter)
 */
export const AUDIT_ACTION_CONFIG: Record<
  AuditAction,
  {
    label: string;
    className: string;
    dotClassName: string;
  }
> = {
  CREATE: {
    label: "Tạo mới",
    className:
      "bg-emerald-100 text-emerald-800 border border-emerald-200",
    dotClassName: "bg-emerald-500",
  },
  UPDATE: {
    label: "Cập nhật",
    className:
      "bg-blue-100 text-blue-800 border border-blue-200",
    dotClassName: "bg-blue-500",
  },
  DELETE: {
    label: "Xóa",
    className:
      "bg-rose-100 text-rose-800 border border-rose-200",
    dotClassName: "bg-rose-500",
  },
  APPROVE: {
    label: "Phê duyệt",
    className:
      "bg-violet-100 text-violet-800 border border-violet-200",
    dotClassName: "bg-violet-500",
  },
  REJECT: {
    label: "Từ chối",
    className:
      "bg-orange-100 text-orange-800 border border-orange-200",
    dotClassName: "bg-orange-500",
  },
  OVERRIDE: {
    label: "Ghi đè",
    className:
      "bg-amber-100 text-amber-800 border border-amber-200",
    dotClassName: "bg-amber-500",
  },
  EXPORT: {
    label: "Xuất dữ liệu",
    className:
      "bg-cyan-100 text-cyan-800 border border-cyan-200",
    dotClassName: "bg-cyan-500",
  },
  VIEW: {
    label: "Xem",
    className:
      "bg-slate-100 text-slate-700 border border-slate-200",
    dotClassName: "bg-slate-400",
  },
  DOWNLOAD: {
    label: "Tải xuống",
    className:
      "bg-indigo-100 text-indigo-800 border border-indigo-200",
    dotClassName: "bg-indigo-500",
  },
  LOGIN: {
    label: "Đăng nhập",
    className:
      "bg-teal-100 text-teal-800 border border-teal-200",
    dotClassName: "bg-teal-500",
  },
  LOCK: {
    label: "Khóa tài khoản",
    className:
      "bg-red-100 text-red-900 border border-red-200",
    dotClassName: "bg-red-600",
  },
  UNLOCK: {
    label: "Mở khóa",
    className:
      "bg-lime-100 text-lime-800 border border-lime-200",
    dotClassName: "bg-lime-500",
  },
  PUBLISH: {
    label: "Công bố",
    className:
      "bg-pink-100 text-pink-800 border border-pink-200",
    dotClassName: "bg-pink-500",
  },
};

/**
 * Danh sách loại thực thể nghiệp vụ được kiểm toán.
 * Hiển thị trong Dropdown bộ lọc.
 */
export const AUDIT_ENTITY_TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Tất cả phân hệ" },
  { value: "USER", label: "Tài khoản người dùng" },
  { value: "EMPLOYEE", label: "Hồ sơ nhân sự" },
  { value: "CONTRACT", label: "Hợp đồng lao động" },
  { value: "WORKFLOW_REQUEST", label: "Yêu cầu phê duyệt" },
  { value: "ROLE", label: "Vai trò & Phân quyền" },
  { value: "DEPARTMENT", label: "Phòng ban & Cơ cấu tổ chức" },
  { value: "NOTIFICATION", label: "Thông báo nội bộ" },
  { value: "AUTH", label: "Xác thực & Bảo mật" },
];

/**
 * Các tùy chọn khoảng thời gian nhanh cho bộ lọc.
 */
export const AUDIT_DATE_RANGE_PRESETS = [
  { label: "Hôm nay", value: "today" },
  { label: "7 ngày qua", value: "7days" },
  { label: "30 ngày qua", value: "30days" },
  { label: "Tháng này", value: "thisMonth" },
] as const;

export type AuditDateRangePreset =
  (typeof AUDIT_DATE_RANGE_PRESETS)[number]["value"];

/** Tên nhãn tiếng Việt cho các loại thực thể */
export const AUDIT_ENTITY_LABEL: Record<string, string> = {
  USER: "Tài khoản",
  EMPLOYEE: "Nhân sự",
  CONTRACT: "Hợp đồng",
  WORKFLOW_REQUEST: "Yêu cầu phê duyệt",
  ROLE: "Vai trò",
  DEPARTMENT: "Phòng ban",
  NOTIFICATION: "Thông báo",
  AUTH: "Xác thực",
};

/** Số bản ghi mặc định mỗi trang */
export const AUDIT_DEFAULT_PAGE_SIZE = 20;

