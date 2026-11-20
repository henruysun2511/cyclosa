import {
  PerformanceCycleType,
  PerformanceCycleStatus,
  ReviewStatus,
  PerformanceRating,
  GoalStatus,
} from "../types/performance.types";

export const PERFORMANCE_CYCLE_TYPE_LABELS: Record<PerformanceCycleType | "ALL", string> = {
  ALL: "Tất cả loại kỳ",
  MONTHLY: "Đánh giá Tháng",
  QUARTERLY: "Đánh giá Quý",
  HALF_YEAR: "Đánh giá 6 Tháng",
  ANNUAL: "Đánh giá Năm",
  PROBATION: "Thử việc / Hết tập sự",
};

export const PERFORMANCE_CYCLE_STATUS_LABELS: Record<PerformanceCycleStatus | "ALL", string> = {
  ALL: "Tất cả trạng thái",
  DRAFT: "Bản nháp",
  ACTIVE: "Đang mở đánh giá",
  CLOSED: "Đã đóng kỳ",
};

export const PERFORMANCE_CYCLE_STATUS_BADGES: Record<
  PerformanceCycleStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; className?: string }
> = {
  DRAFT: {
    label: "Bản nháp",
    variant: "secondary",
    className: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
  ACTIVE: {
    label: "Đang mở đánh giá",
    variant: "default",
    className: "bg-emerald-600 text-white hover:bg-emerald-700",
  },
  CLOSED: {
    label: "Đã đóng kỳ",
    variant: "outline",
    className: "border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-400",
  },
};

export const REVIEW_STATUS_LABELS: Record<ReviewStatus | "ALL", string> = {
  ALL: "Tất cả trạng thái",
  DRAFT: "Chưa đánh giá",
  SELF_REVIEWED: "Đã tự đánh giá",
  MANAGER_REVIEWED: "Quản lý đã chấm",
  FINALIZED: "Đã chốt kết quả",
};

export const REVIEW_STATUS_BADGES: Record<
  ReviewStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; className?: string }
> = {
  DRAFT: {
    label: "Chưa đánh giá",
    variant: "secondary",
    className: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
  SELF_REVIEWED: {
    label: "Đã tự đánh giá",
    variant: "secondary",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  },
  MANAGER_REVIEWED: {
    label: "Quản lý đã chấm",
    variant: "secondary",
    className: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  },
  FINALIZED: {
    label: "Đã chốt kết quả",
    variant: "default",
    className: "bg-purple-600 text-white hover:bg-purple-700",
  },
};

export const PERFORMANCE_RATING_LABELS: Record<PerformanceRating | "ALL", string> = {
  ALL: "Tất cả xếp loại",
  EXCELLENT: "Xuất sắc (A)",
  GOOD: "Tốt (B)",
  SATISFACTORY: "Đạt (C)",
  NEEDS_IMPROVEMENT: "Cần cải thiện (D)",
  POOR: "Không đạt (E)",
};

export const PERFORMANCE_RATING_BADGES: Record<
  PerformanceRating,
  { label: string; className: string }
> = {
  EXCELLENT: {
    label: "Xuất sắc (A)",
    className: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300",
  },
  GOOD: {
    label: "Tốt (B)",
    className: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300",
  },
  SATISFACTORY: {
    label: "Đạt (C)",
    className: "bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-950 dark:text-cyan-300",
  },
  NEEDS_IMPROVEMENT: {
    label: "Cần cải thiện (D)",
    className: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300",
  },
  POOR: {
    label: "Không đạt (E)",
    className: "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300",
  },
};

export const GOAL_STATUS_LABELS: Record<GoalStatus | "ALL", string> = {
  ALL: "Tất cả tiến độ",
  NOT_STARTED: "Chưa bắt đầu",
  IN_PROGRESS: "Đang thực hiện",
  ACHIEVED: "Đã hoàn thành",
  CANCELLED: "Đã hủy bỏ",
};

export const GOAL_STATUS_BADGES: Record<
  GoalStatus,
  { label: string; className: string }
> = {
  NOT_STARTED: {
    label: "Chưa bắt đầu",
    className: "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300",
  },
  IN_PROGRESS: {
    label: "Đang thực hiện",
    className: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300",
  },
  ACHIEVED: {
    label: "Đã hoàn thành",
    className: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300",
  },
  CANCELLED: {
    label: "Đã hủy bỏ",
    className: "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300",
  },
};
