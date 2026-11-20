import { Readiness, RiskLevel, TalentTag } from "../types/career.types";

export const RISK_LEVEL_CONFIG: Record<
  RiskLevel,
  { label: string; badgeVariant: string; className: string }
> = {
  LOW: {
    label: "Thấp",
    badgeVariant: "secondary",
    className: "bg-emerald-600 text-white font-medium border-transparent shadow-2xs",
  },
  MEDIUM: {
    label: "Trung bình",
    badgeVariant: "warning",
    className: "bg-amber-600 text-white font-medium border-transparent shadow-2xs",
  },
  HIGH: {
    label: "Cao",
    badgeVariant: "destructive",
    className: "bg-rose-600 text-white font-medium border-transparent shadow-2xs",
  },
  CRITICAL: {
    label: "Nguy cấp",
    badgeVariant: "destructive",
    className: "bg-purple-700 text-white font-semibold border-transparent shadow-2xs",
  },
};

export const READINESS_CONFIG: Record<
  Readiness,
  { label: string; className: string }
> = {
  READY_NOW: {
    label: "Sẵn sàng ngay",
    className: "bg-emerald-600 text-white font-medium border-transparent shadow-2xs",
  },
  WITHIN_1_YEAR: {
    label: "Trong vòng 1 năm",
    className: "bg-blue-600 text-white font-medium border-transparent shadow-2xs",
  },
  WITHIN_2_YEARS: {
    label: "Trong vòng 2 năm",
    className: "bg-amber-600 text-white font-medium border-transparent shadow-2xs",
  },
  MORE_THAN_2_YEARS: {
    label: "Trên 2 năm",
    className: "bg-slate-600 text-white font-medium border-transparent shadow-2xs",
  },
};

export const TALENT_TAG_CONFIG: Record<
  TalentTag,
  { label: string; className: string; description: string }
> = {
  HI_PO: {
    label: "Hi-Po (Tiềm năng cao)",
    className: "bg-indigo-600 text-white font-medium border-transparent shadow-2xs",
    description: "Nhân sự có tiềm năng lãnh đạo và tốc độ học tập vượt trội",
  },
  TOP_TALENT: {
    label: "Nhân tài xuất sắc (Top Talent)",
    className: "bg-amber-600 text-white font-medium border-transparent shadow-2xs",
    description: "Nhân sự đạt hiệu suất cao liên tục và có đóng góp then chốt",
  },
  CRITICAL_SKILL: {
    label: "Kỹ năng cốt lõi / Chuyên gia",
    className: "bg-purple-600 text-white font-medium border-transparent shadow-2xs",
    description: "Sở hữu chuyên môn kỹ thuật hoặc kỹ năng hiếm, khó thay thế",
  },
  FLIGHT_RISK: {
    label: "Nguy cơ thôi việc (Flight Risk)",
    className: "bg-rose-600 text-white font-medium border-transparent shadow-2xs",
    description: "Nhân tài quan trọng cần can thiệp chính sách giữ chân kịp thời",
  },
};
