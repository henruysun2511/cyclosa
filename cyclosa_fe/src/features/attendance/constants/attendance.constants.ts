import type {
  AttendanceEventType,
  VerificationResult,
  AttendanceRequestType,
  AttendanceRequestStatus,
  DailyAttendanceStatus,
  OvertimeDayType,
  TimesheetPeriodStatus,
} from "../types/attendance.types";

// ==========================================
// 1. Nhãn & Màu Sắc Badge Cho Trạng Thái Công Ngày
// ==========================================

export const DAILY_ATTENDANCE_STATUS_MAP: Record<
  DailyAttendanceStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning"; colorClass: string; badgeChar: string }
> = {
  ON_TIME: {
    label: "Đúng giờ",
    variant: "success",
    colorClass: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
    badgeChar: "1.0",
  },
  LATE: {
    label: "Đi muộn",
    variant: "warning",
    colorClass: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
    badgeChar: "M",
  },
  EARLY: {
    label: "Về sớm",
    variant: "warning",
    colorClass: "bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/30",
    badgeChar: "S",
  },
  LATE_AND_EARLY: {
    label: "Muộn & Về sớm",
    variant: "warning",
    colorClass: "bg-amber-600/15 text-amber-800 dark:text-amber-300 border-amber-600/30",
    badgeChar: "M+S",
  },
  MISSING_CHECK_OUT: {
    label: "Thiếu Check-out",
    variant: "destructive",
    colorClass: "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30",
    badgeChar: "!",
  },
  ABSENT: {
    label: "Vắng mặt",
    variant: "destructive",
    colorClass: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30",
    badgeChar: "V",
  },
  REST_DAY: {
    label: "Nghỉ tuần",
    variant: "secondary",
    colorClass: "bg-slate-500/15 text-slate-700 dark:text-slate-400 border-slate-500/30",
    badgeChar: "OFF",
  },
  LEAVE_PAID: {
    label: "Nghỉ phép có lương",
    variant: "outline",
    colorClass: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30",
    badgeChar: "P",
  },
  LEAVE_UNPAID: {
    label: "Nghỉ không lương",
    variant: "outline",
    colorClass: "bg-zinc-500/15 text-zinc-700 dark:text-zinc-400 border-zinc-500/30",
    badgeChar: "KL",
  },
  HOLIDAY: {
    label: "Nghỉ Lễ / Tết",
    variant: "secondary",
    colorClass: "bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30",
    badgeChar: "LỄ",
  },
  EXPLAINED: {
    label: "Đã giải trình duyệt",
    variant: "success",
    colorClass: "bg-teal-500/15 text-teal-700 dark:text-teal-400 border-teal-500/30",
    badgeChar: "GT",
  },
};

// ==========================================
// 2. Nhãn & Màu Sắc Kết Quả Xác Thực AI
// ==========================================

export const VERIFICATION_RESULT_MAP: Record<
  VerificationResult,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning"; description: string }
> = {
  SUCCESS: {
    label: "Hợp lệ",
    variant: "success",
    description: "Khuôn mặt khớp và tọa độ GPS nằm trong bán kính văn phòng",
  },
  OUT_OF_RANGE: {
    label: "Ngoài bán kính GPS",
    variant: "destructive",
    description: "Tọa độ GPS nằm ngoài phạm vi cho phép của chi nhánh",
  },
  FACE_MISMATCH: {
    label: "Không khớp mặt",
    variant: "destructive",
    description: "Điểm so khớp sinh trắc học AI thấp hơn ngưỡng quy định",
  },
  LIVENESS_FAILED: {
    label: "Nghi vấn giả mạo",
    variant: "destructive",
    description: "Không vượt qua kiểm tra chống chụp lại màn hình (Anti-Spoofing)",
  },
  NO_ENROLLMENT: {
    label: "Chưa đăng ký mặt",
    variant: "warning",
    description: "Hồ sơ nhân viên chưa được đăng ký mẫu khuôn mặt ban đầu",
  },
  LOW_IMAGE_QUALITY: {
    label: "Ảnh kém chất lượng",
    variant: "warning",
    description: "Ảnh quá mờ hoặc ngược sáng không thể nhận diện",
  },
  DUPLICATE_OR_SEQUENCE_ERROR: {
    label: "Quẹt thẻ quá nhanh",
    variant: "warning",
    description: "Mã giao dịch bị trùng lặp hoặc quẹt liên tiếp trong khoảng ngắn",
  },
};

// ==========================================
// 3. Loại Sự Kiện Chấm Công
// ==========================================

export const ATTENDANCE_EVENT_TYPE_MAP: Record<AttendanceEventType, { label: string; colorClass: string }> = {
  CHECK_IN: { label: "Vào ca (Check-in)", colorClass: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30" },
  CHECK_OUT: { label: "Tan ca (Check-out)", colorClass: "text-amber-600 bg-amber-50 dark:bg-amber-950/30" },
};

// ==========================================
// 4. Đơn Giải Trình Chấm Công
// ==========================================

export const ATTENDANCE_REQUEST_TYPES = [
  { value: "FORGOT_PUNCH", label: "Quên quẹt thẻ" },
  { value: "TIME_DEVIATION", label: "Sai lệch thời gian" },
  { value: "ATTENDANCE_EXPLANATION", label: "Giải trình đi muộn / về sớm" },
  { value: "OVERTIME_REGISTRATION", label: "Đăng ký làm thêm giờ (OT)" },
];

export const DAYS_OF_WEEK = [
  { value: 1, label: "Thứ 2" },
  { value: 2, label: "Thứ 3" },
  { value: 3, label: "Thứ 4" },
  { value: 4, label: "Thứ 5" },
  { value: 5, label: "Thứ 6" },
  { value: 6, label: "Thứ 7" },
  { value: 7, label: "Chủ nhật" },
];

export const ATTENDANCE_REQUEST_TYPE_MAP: Record<AttendanceRequestType, { label: string; description: string }> = {
  FORGOT_PUNCH: {
    label: "Quên quẹt thẻ",
    description: "Có đi làm thực tế nhưng quên thao tác check-in hoặc check-out",
  },
  TIME_DEVIATION: {
    label: "Lệch giờ thực tế",
    description: "Giờ ghi nhận trên hệ thống bị sai lệch do sự cố kỹ thuật",
  },
  DEVICE_FAILURE: {
    label: "Lỗi thiết bị / Camera",
    description: "Điện thoại hết pin, camera lỗi hoặc mất kết nối mạng",
  },
  BUSINESS_TRIP: {
    label: "Đi công tác / Gặp khách hàng",
    description: "Làm việc ngoài văn phòng theo quyết định cử đi công tác",
  },
  OTHER: {
    label: "Lý do khác",
    description: "Các trường hợp đặc thù khác có xác nhận của quản lý",
  },
};

export const ATTENDANCE_REQUEST_STATUS_MAP: Record<
  AttendanceRequestStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" }
> = {
  PENDING: { label: "Chờ phê duyệt", variant: "warning" },
  APPROVED: { label: "Đã phê duyệt", variant: "success" },
  REJECTED: { label: "Đã từ chối", variant: "destructive" },
  CANCELLED: { label: "Đã hủy bỏ", variant: "secondary" },
};

// ==========================================
// 5. Kỳ Công Tháng
// ==========================================

export const TIMESHEET_PERIOD_STATUS_MAP: Record<
  TimesheetPeriodStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning"; description: string }
> = {
  OPEN: {
    label: "Đang mở (Chưa khóa)",
    variant: "warning",
    description: "Số liệu công đang được cập nhật và đối soát thời gian thực",
  },
  LOCKED: {
    label: "Đã khóa sổ",
    variant: "success",
    description: "Đã chốt bản chụp snapshot bất biến và chuyển sang tính lương",
  },
};

export const OVERTIME_DAY_TYPE_MAP: Record<OvertimeDayType, { label: string; rateMultiplier: number }> = {
  NORMAL_DAY: { label: "Làm thêm ngày thường", rateMultiplier: 1.5 },
  WEEKEND: { label: "Làm thêm ngày nghỉ tuần", rateMultiplier: 2.0 },
  PUBLIC_HOLIDAY: { label: "Làm thêm ngày Lễ/Tết", rateMultiplier: 3.0 },
};

// ==========================================
// 6. Navigation Tabs Trong Phân Hệ Chấm Công
// ==========================================

export const ATTENDANCE_NAV_ITEMS = [
  { label: "Ca làm việc", href: "/attendance/shifts", permission: "attendance.view" },
  { label: "Phân ca", href: "/attendance/shift-assignments", permission: "attendance.view" },
  { label: "Bảng công tháng", href: "/attendance/monthly-summary", permission: "attendance.view" },
  { label: "Công theo ngày", href: "/attendance/daily-records", permission: "attendance.view" },
  { label: "Ngoại lệ công", href: "/attendance/exceptions", permission: "attendance.view" },
  { label: "Đơn giải trình", href: "/attendance/requests", permission: "attendance.view" },
  { label: "Điều chỉnh công", href: "/attendance/adjustments", permission: "attendance.view" },
  { label: "Nhật ký quẹt thẻ", href: "/attendance/logs", permission: "attendance.view" },
  { label: "Kỳ công tháng", href: "/attendance/periods", permission: "attendance.view" },
];

