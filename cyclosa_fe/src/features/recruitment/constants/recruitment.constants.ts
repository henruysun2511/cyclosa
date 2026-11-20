// ============================================================================
// RECRUITMENT CONSTANTS (100% VIETNAMESE LABELS & SYSTEM DESIGN TOKENS)
// ============================================================================

import type {
  RecruitmentRequestStatus,
  JobOpeningStatus,
  EmploymentType,
  WorkplaceType,
  ApplicationStage,
  InterviewRoundType,
  InterviewFormat,
  InterviewStatus,
  ScorecardRecommendation,
  OfferStatus,
  InternalOpportunityType,
  InternalOpportunityAppStatus,
} from "../types/recruitment.types";

// ── 1. Đề xuất tuyển dụng (Recruitment Request) ────────────────────────────

export const RECRUITMENT_REQUEST_STATUS_LABELS: Record<RecruitmentRequestStatus, string> = {
  PENDING_APPROVAL: "Chờ phê duyệt",
  APPROVED: "Đã phê duyệt",
  REJECTED: "Đã từ chối",
  CANCELLED: "Đã hủy bỏ",
};

export const RECRUITMENT_REQUEST_STATUS_BADGES: Record<
  RecruitmentRequestStatus,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive"; className: string }
> = {
  PENDING_APPROVAL: {
    label: "Chờ phê duyệt",
    variant: "secondary",
    className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300",
  },
  APPROVED: {
    label: "Đã phê duyệt",
    variant: "default",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300",
  },
  REJECTED: {
    label: "Đã từ chối",
    variant: "destructive",
    className: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300",
  },
  CANCELLED: {
    label: "Đã hủy bỏ",
    variant: "outline",
    className: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400",
  },
};

export const RECRUITMENT_REQUEST_STATUS_OPTIONS = [
  { value: "ALL", label: "Tất cả trạng thái" },
  { value: "PENDING_APPROVAL", label: "Chờ phê duyệt" },
  { value: "APPROVED", label: "Đã phê duyệt" },
  { value: "REJECTED", label: "Đã từ chối" },
  { value: "CANCELLED", label: "Đã hủy bỏ" },
];

// ── 2. Vị trí tuyển dụng (Job Opening) ──────────────────────────────────────

export const JOB_OPENING_STATUS_LABELS: Record<JobOpeningStatus, string> = {
  DRAFT: "Bản nháp",
  OPEN: "Đang mở tuyển",
  ON_HOLD: "Tạm dừng",
  CLOSED: "Đã đóng tuyển",
  CANCELLED: "Đã hủy",
};

export const JOB_OPENING_STATUS_BADGES: Record<
  JobOpeningStatus,
  { label: string; className: string }
> = {
  DRAFT: {
    label: "Bản nháp",
    className: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300",
  },
  OPEN: {
    label: "Đang mở tuyển",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300",
  },
  ON_HOLD: {
    label: "Tạm dừng",
    className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300",
  },
  CLOSED: {
    label: "Đã đóng tuyển",
    className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300",
  },
  CANCELLED: {
    label: "Đã hủy",
    className: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300",
  },
};

export const JOB_OPENING_STATUS_OPTIONS = [
  { value: "ALL", label: "Tất cả trạng thái" },
  { value: "DRAFT", label: "Bản nháp" },
  { value: "OPEN", label: "Đang mở tuyển" },
  { value: "ON_HOLD", label: "Tạm dừng" },
  { value: "CLOSED", label: "Đã đóng tuyển" },
  { value: "CANCELLED", label: "Đã hủy" },
];

// ── 3. Loại hợp đồng (Employment Type) ──────────────────────────────────────

export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  FULL_TIME: "Toàn thời gian (Full-time)",
  PART_TIME: "Bán thời gian (Part-time)",
  CONTRACT: "Hợp đồng dự án / Thời vụ",
  INTERNSHIP: "Thực tập sinh",
  TEMPORARY: "Tạm thời",
};

export const EMPLOYMENT_TYPE_OPTIONS = [
  { value: "ALL", label: "Tất cả hình thức" },
  { value: "FULL_TIME", label: "Toàn thời gian (Full-time)" },
  { value: "PART_TIME", label: "Bán thời gian (Part-time)" },
  { value: "CONTRACT", label: "Hợp đồng dự án / Thời vụ" },
  { value: "INTERNSHIP", label: "Thực tập sinh" },
  { value: "TEMPORARY", label: "Tạm thời" },
];

// ── 4. Hình thức làm việc (Workplace Type) ──────────────────────────────────

export const WORKPLACE_TYPE_LABELS: Record<WorkplaceType, string> = {
  ONSITE: "Tại văn phòng (On-site)",
  HYBRID: "Linh hoạt (Hybrid)",
  REMOTE: "Từ xa (Remote)",
};

export const WORKPLACE_TYPE_OPTIONS = [
  { value: "ONSITE", label: "Tại văn phòng (On-site)" },
  { value: "HYBRID", label: "Linh hoạt (Hybrid)" },
  { value: "REMOTE", label: "Từ xa (Remote)" },
];

// ── 5. Giai đoạn ATS Pipeline ───────────────────────────────────────────────

export const APPLICATION_STAGE_LABELS: Record<ApplicationStage, string> = {
  APPLIED: "Mới ứng tuyển",
  SCREENING: "Sàng lọc CV",
  INTERVIEW: "Phỏng vấn",
  OFFER: "Đề xuất Offer",
  HIRED: "Đã tiếp nhận",
  REJECTED: "Không phù hợp",
  WITHDRAWN: "Rút hồ sơ",
};

export const ATS_PIPELINE_STAGES: {
  id: ApplicationStage;
  label: string;
  accentColor: string;
  badgeBg: string;
}[] = [
  {
    id: "APPLIED",
    label: "Mới ứng tuyển",
    accentColor: "bg-sky-500",
    badgeBg: "text-sky-700 bg-sky-50 dark:bg-sky-950/40 dark:text-sky-300",
  },
  {
    id: "SCREENING",
    label: "Sàng lọc CV",
    accentColor: "bg-blue-500",
    badgeBg: "text-blue-700 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-300",
  },
  {
    id: "INTERVIEW",
    label: "Phỏng vấn",
    accentColor: "bg-purple-500",
    badgeBg: "text-purple-700 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-300",
  },
  {
    id: "OFFER",
    label: "Đề xuất Offer",
    accentColor: "bg-amber-500",
    badgeBg: "text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300",
  },
  {
    id: "HIRED",
    label: "Đã tiếp nhận",
    accentColor: "bg-emerald-500",
    badgeBg: "text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300",
  },
  {
    id: "REJECTED",
    label: "Không phù hợp",
    accentColor: "bg-slate-400",
    badgeBg: "text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-300",
  },
  {
    id: "WITHDRAWN",
    label: "Rút hồ sơ",
    accentColor: "bg-zinc-400",
    badgeBg: "text-zinc-600 bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300",
  },
];

// ── 6. Vòng phỏng vấn (Interview Round) ────────────────────────────────────

export const INTERVIEW_ROUND_TYPE_LABELS: Record<InterviewRoundType, string> = {
  HR: "Sơ loại Nhân sự (HR)",
  TECHNICAL: "Kỹ thuật Chuyên môn (Technical)",
  CULTURE_FIT: "Văn hóa Doanh nghiệp (Culture Fit)",
  EXECUTIVE: "Ban Giám đốc (Executive)",
  FINAL: "Vòng Chung cuộc (Final)",
};

export const INTERVIEW_ROUND_TYPE_OPTIONS = [
  { value: "ALL", label: "Tất cả vòng phỏng vấn" },
  { value: "HR", label: "Sơ loại Nhân sự (HR)" },
  { value: "TECHNICAL", label: "Kỹ thuật Chuyên môn (Technical)" },
  { value: "CULTURE_FIT", label: "Văn hóa Doanh nghiệp (Culture Fit)" },
  { value: "EXECUTIVE", label: "Ban Giám đốc (Executive)" },
  { value: "FINAL", label: "Vòng Chung cuộc (Final)" },
];

export const INTERVIEW_FORMAT_LABELS: Record<InterviewFormat, string> = {
  ONLINE: "Phỏng vấn Trực tuyến (Online)",
  OFFLINE: "Phỏng vấn Trực tiếp (Offline)",
  HYBRID: "Kết hợp (Hybrid)",
};

export const INTERVIEW_STATUS_LABELS: Record<InterviewStatus, string> = {
  SCHEDULED: "Đã lên lịch",
  COMPLETED: "Đã hoàn thành",
  CANCELLED: "Đã hủy bỏ",
  RESCHEDULED: "Đã đổi lịch",
};

export const INTERVIEW_STATUS_OPTIONS = [
  { value: "ALL", label: "Tất cả trạng thái" },
  { value: "SCHEDULED", label: "Đã lên lịch" },
  { value: "COMPLETED", label: "Đã hoàn thành" },
  { value: "CANCELLED", label: "Đã hủy bỏ" },
  { value: "RESCHEDULED", label: "Đã đổi lịch" },
];

export const INTERVIEW_STATUS_BADGES: Record<
  InterviewStatus,
  { label: string; className: string }
> = {
  SCHEDULED: {
    label: "Đã lên lịch",
    className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300",
  },
  COMPLETED: {
    label: "Đã hoàn thành",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300",
  },
  CANCELLED: {
    label: "Đã hủy bỏ",
    className: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300",
  },
  RESCHEDULED: {
    label: "Đã đổi lịch",
    className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300",
  },
};

// ── 7. Khuyến nghị Phiếu chấm điểm (Scorecard) ──────────────────────────────

export const SCORECARD_RECOMMENDATION_LABELS: Record<ScorecardRecommendation, string> = {
  STRONG_YES: "Rất đồng ý tuyển (Strong Hire)",
  YES: "Đồng ý tuyển (Hire)",
  NO: "Không đồng ý (No Hire)",
  STRONG_NO: "Tuyệt đối không (Strong No Hire)",
};

export const SCORECARD_RECOMMENDATION_OPTIONS = [
  { value: "STRONG_YES", label: "Rất đồng ý tuyển (Strong Hire)", className: "text-emerald-600 font-semibold" },
  { value: "YES", label: "Đồng ý tuyển (Hire)", className: "text-blue-600 font-medium" },
  { value: "NO", label: "Không đồng ý (No Hire)", className: "text-amber-600 font-medium" },
  { value: "STRONG_NO", label: "Tuyệt đối không (Strong No Hire)", className: "text-rose-600 font-semibold" },
];

// ── 8. Thư mời nhận việc (Offer) ───────────────────────────────────────────

export const OFFER_STATUS_LABELS: Record<OfferStatus, string> = {
  DRAFT: "Bản nháp",
  PENDING_APPROVAL: "Chờ duyệt lương",
  APPROVED: "Đã duyệt lương",
  SENT: "Đã gửi ứng viên",
  ACCEPTED: "Ứng viên đã nhận việc",
  DECLINED: "Ứng viên từ chối",
  EXPIRED: "Đã hết hạn",
  CANCELLED: "Đã hủy",
};

export const OFFER_STATUS_BADGES: Record<
  OfferStatus,
  { label: string; className: string }
> = {
  DRAFT: {
    label: "Bản nháp",
    className: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300",
  },
  PENDING_APPROVAL: {
    label: "Chờ duyệt lương",
    className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300",
  },
  APPROVED: {
    label: "Đã duyệt lương",
    className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300",
  },
  SENT: {
    label: "Đã gửi ứng viên",
    className: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300",
  },
  ACCEPTED: {
    label: "Ứng viên đã nhận việc",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300",
  },
  DECLINED: {
    label: "Ứng viên từ chối",
    className: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300",
  },
  EXPIRED: {
    label: "Đã hết hạn",
    className: "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300",
  },
  CANCELLED: {
    label: "Đã hủy",
    className: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300",
  },
};

export const OFFER_STATUS_OPTIONS = [
  { value: "ALL", label: "Tất cả trạng thái" },
  { value: "DRAFT", label: "Bản nháp" },
  { value: "PENDING_APPROVAL", label: "Chờ duyệt lương" },
  { value: "APPROVED", label: "Đã duyệt lương" },
  { value: "SENT", label: "Đã gửi ứng viên" },
  { value: "ACCEPTED", label: "Ứng viên đã nhận việc" },
  { value: "DECLINED", label: "Ứng viên từ chối" },
  { value: "EXPIRED", label: "Đã hết hạn" },
  { value: "CANCELLED", label: "Đã hủy" },
];

// ── 9. Cơ hội nội bộ (Internal Opportunity) ────────────────────────────────

export const INTERNAL_OPPORTUNITY_TYPE_LABELS: Record<InternalOpportunityType, string> = {
  TRANSFER: "Thuyên chuyển vị trí",
  PROMOTION: "Cơ hội thăng tiến",
  SHORT_TERM_PROJECT: "Dự án trọng điểm ngắn hạn",
};

export const INTERNAL_OPPORTUNITY_APP_STATUS_LABELS: Record<InternalOpportunityAppStatus, string> = {
  APPLIED: "Đã nộp nguyện vọng",
  REVIEWING: "HR & Quản lý đang xét duyệt",
  APPROVED: "Đã phê duyệt tiếp nhận",
  REJECTED: "Chưa phù hợp",
};
