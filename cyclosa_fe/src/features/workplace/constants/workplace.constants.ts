import type {
  SeatStatus,
  SeatType,
  WorkplaceIssueStatus,
  IssueSeverity,
  WorkplaceIssueType,
  BookingStatus,
} from "../types/workplace.types";

export const SEAT_STATUS_OPTIONS: { value: SeatStatus; label: string; color: string; badgeVariant: "default" | "secondary" | "destructive" | "outline" }[] = [
  { value: "IN_SERVICE", label: "Sẵn sàng sử dụng", color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20", badgeVariant: "default" },
  { value: "MAINTENANCE", label: "Đang bảo trì", color: "text-amber-600 bg-amber-500/10 border-amber-500/20", badgeVariant: "secondary" },
  { value: "BLOCKED", label: "Tạm khóa", color: "text-rose-600 bg-rose-500/10 border-rose-500/20", badgeVariant: "destructive" },
];

export const SEAT_TYPE_OPTIONS: { value: SeatType; label: string }[] = [
  { value: "DEDICATED", label: "Chỗ ngồi cố định" },
  { value: "HOT_DESK", label: "Chỗ ngồi linh hoạt (Hot-desk)" },
  { value: "VISITOR", label: "Khách vãng lai" },
];

export const ISSUE_STATUS_OPTIONS: { value: WorkplaceIssueStatus; label: string; color: string; badgeVariant: "default" | "secondary" | "destructive" | "outline" }[] = [
  { value: "OPEN", label: "Chờ tiếp nhận", color: "text-amber-600 bg-amber-500/10 border-amber-500/20", badgeVariant: "secondary" },
  { value: "IN_PROGRESS", label: "Đang xử lý", color: "text-blue-600 bg-blue-500/10 border-blue-500/20", badgeVariant: "default" },
  { value: "RESOLVED", label: "Đã khắc phục", color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20", badgeVariant: "outline" },
];

export const ISSUE_SEVERITY_OPTIONS: { value: IssueSeverity; label: string; color: string }[] = [
  { value: "LOW", label: "Thấp", color: "text-slate-600 bg-slate-500/10" },
  { value: "MEDIUM", label: "Trung bình", color: "text-amber-600 bg-amber-500/10" },
  { value: "HIGH", label: "Nghiêm trọng", color: "text-rose-600 bg-rose-500/10" },
];

export const ISSUE_TYPE_OPTIONS: { value: WorkplaceIssueType; label: string }[] = [
  { value: "ELECTRICAL", label: "Điện & Ổ cắm" },
  { value: "AIR_CONDITIONING", label: "Điều hòa & Thông gió" },
  { value: "FURNITURE", label: "Bàn ghế & Nội thất" },
  { value: "HARDWARE", label: "Thiết bị & Màn hình" },
  { value: "CLEANING", label: "Vệ sinh không gian" },
  { value: "OTHER", label: "Sự cố khác" },
];

export const BOOKING_STATUS_OPTIONS: { value: BookingStatus; label: string; color: string }[] = [
  { value: "CONFIRMED", label: "Đã xác nhận", color: "text-blue-600 bg-blue-500/10" },
  { value: "CHECKED_IN", label: "Đã Check-in", color: "text-emerald-600 bg-emerald-500/10" },
  { value: "CANCELLED", label: "Đã hủy", color: "text-slate-500 bg-slate-500/10" },
];
