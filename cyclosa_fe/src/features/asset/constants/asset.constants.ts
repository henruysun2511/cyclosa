import { AssetCondition, AssetStatus } from "../types/asset.types";

export const ASSET_STATUS_LABELS: Record<AssetStatus, string> = {
  AVAILABLE: "Sẵn sàng cấp",
  ASSIGNED: "Đang cấp phát",
  IN_REPAIR: "Đang sửa chữa",
  DAMAGED: "Hỏng hóc",
  DISPOSED: "Đã thanh lý",
};

export const ASSET_STATUS_COLORS: Record<
  AssetStatus,
  { bg: string; text: string; border: string; badgeVariant?: string }
> = {
  AVAILABLE: {
    bg: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-800",
  },
  ASSIGNED: {
    bg: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
  },
  IN_REPAIR: {
    bg: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800",
  },
  DAMAGED: {
    bg: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400",
    text: "text-rose-700 dark:text-rose-400",
    border: "border-rose-200 dark:border-rose-800",
  },
  DISPOSED: {
    bg: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
    text: "text-slate-700 dark:text-slate-400",
    border: "border-slate-200 dark:border-slate-700",
  },
};

export const ASSET_CONDITION_LABELS: Record<AssetCondition, string> = {
  NEW: "Mới 100%",
  GOOD: "Tốt",
  FAIR: "Trung bình",
  MAINTENANCE_REQUIRED: "Cần bảo trì",
  DAMAGED: "Hỏng vật lý",
};

export const ASSET_CONDITION_COLORS: Record<
  AssetCondition,
  { bg: string; text: string }
> = {
  NEW: {
    bg: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-400",
    text: "text-cyan-700 dark:text-cyan-400",
  },
  GOOD: {
    bg: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
    text: "text-emerald-700 dark:text-emerald-400",
  },
  FAIR: {
    bg: "bg-slate-50 text-slate-700 dark:bg-slate-900 dark:text-slate-400",
    text: "text-slate-700 dark:text-slate-400",
  },
  MAINTENANCE_REQUIRED: {
    bg: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
    text: "text-amber-700 dark:text-amber-400",
  },
  DAMAGED: {
    bg: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400",
    text: "text-rose-700 dark:text-rose-400",
  },
};
