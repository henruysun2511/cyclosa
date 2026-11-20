// ============================================================================
// TIỆN ÍCH PHÂN HỆ NHẬT KÝ KIỂM TOÁN & TRUY VẾT (MOD-19)
// ============================================================================

import type { ChangedField } from "../types/audit.types";
import type { DiffFieldChange } from "@/components/shared/audit-side-by-side-diff";

/**
 * Định dạng ngày giờ thành chuỗi tiếng Việt: "dd/MM/yyyy HH:mm:ss"
 */
export function formatAuditDateTime(isoString: string | null | undefined): string {
  if (!isoString) return "—";
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "—";
    const pad = (n: number) => String(n).padStart(2, "0");
    return (
      `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ` +
      `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
    );
  } catch {
    return "—";
  }
}

/**
 * Định dạng ngày giờ thành chuỗi ngắn gọn: "dd/MM/yyyy"
 */
export function formatAuditDate(isoString: string | null | undefined): string {
  if (!isoString) return "—";
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "—";
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
  } catch {
    return "—";
  }
}

/**
 * Tính khoảng cách thời gian tương đối (dùng cho Audit Trail Timeline)
 */
export function formatAuditTimeAgo(isoString: string | null | undefined): string {
  if (!isoString) return "—";
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return "vừa xong";
    if (diffMinutes < 60) return `${diffMinutes} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return formatAuditDate(isoString);
  } catch {
    return "—";
  }
}

/**
 * Chuyển đổi danh sách ChangedField từ Backend sang DiffFieldChange của AuditSideBySideDiff
 */
export function mapChangedFieldsToDiff(
  changedFields: ChangedField[] | null | undefined
): DiffFieldChange[] {
  if (!changedFields || changedFields.length === 0) return [];
  return changedFields.map((f) => ({
    fieldName: f.field,
    fieldLabel: f.displayName || f.field,
    oldValue: formatFieldValue(f.oldValue),
    newValue: formatFieldValue(f.newValue),
  }));
}

/**
 * Format giá trị một trường dữ liệu thành chuỗi hiển thị thân thiện
 */
function formatFieldValue(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "boolean") return value ? "Có (True)" : "Không (False)";
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  return String(value);
}

/**
 * Tạo chuỗi initials từ họ tên (tối đa 2 ký tự, viết hoa)
 */
export function getActorInitials(fullName: string | null | undefined): string {
  if (!fullName) return "?";
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (
    parts[0].charAt(0).toUpperCase() + parts[parts.length - 1].charAt(0).toUpperCase()
  );
}

/**
 * Tính ngày bắt đầu và kết thúc từ preset chọn nhanh
 */
export function getDateRangeFromPreset(preset: string): {
  from: string;
  to: string;
} {
  const now = new Date();
  const toStr = now.toISOString().slice(0, 19);

  if (preset === "today") {
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return { from: start.toISOString().slice(0, 19), to: toStr };
  }
  if (preset === "7days") {
    const start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return { from: start.toISOString().slice(0, 19), to: toStr };
  }
  if (preset === "30days") {
    const start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    return { from: start.toISOString().slice(0, 19), to: toStr };
  }
  if (preset === "thisMonth") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return { from: start.toISOString().slice(0, 19), to: toStr };
  }
  return { from: "", to: "" };
}

/**
 * Lấy màu nền ngẫu nhiên nhất quán cho avatar dựa trên userId
 */
const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-orange-500",
  "bg-teal-500",
  "bg-rose-500",
  "bg-indigo-500",
  "bg-amber-500",
  "bg-cyan-500",
  "bg-pink-500",
];

export function getActorAvatarColor(userId: string): string {
  if (!userId) return AVATAR_COLORS[0];
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

