import {
  Bell,
  Briefcase,
  CheckSquare,
  DollarSign,
  FileText,
  Megaphone,
  ShieldAlert,
} from "lucide-react";
import type { NotificationType, NotificationTab } from "../types/notification.types";

export const NOTIFICATION_TYPE_CONFIG: Record<
  NotificationType,
  {
    label: string;
    icon: typeof Bell;
    badgeClassName: string;
    iconBgClassName: string;
  }
> = {
  WORKFLOW: {
    label: "Phê duyệt",
    icon: CheckSquare,
    badgeClassName: "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-900",
    iconBgClassName: "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
  },
  CONTRACT: {
    label: "Hợp đồng",
    icon: FileText,
    badgeClassName: "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-900",
    iconBgClassName: "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400",
  },
  PAYROLL: {
    label: "Tiền lương",
    icon: DollarSign,
    badgeClassName: "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-900",
    iconBgClassName: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
  },
  ANNOUNCEMENT: {
    label: "Thông báo chung",
    icon: Megaphone,
    badgeClassName: "bg-purple-500/10 text-purple-600 border-purple-200 dark:border-purple-900",
    iconBgClassName: "bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400",
  },
  SYSTEM: {
    label: "Hệ thống",
    icon: ShieldAlert,
    badgeClassName: "bg-rose-500/10 text-rose-600 border-rose-200 dark:border-rose-900",
    iconBgClassName: "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400",
  },
  RECRUITMENT: {
    label: "Tuyển dụng",
    icon: Briefcase,
    badgeClassName: "bg-indigo-500/10 text-indigo-600 border-indigo-200 dark:border-indigo-900",
    iconBgClassName: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400",
  },
};

export const NOTIFICATION_TABS: { id: NotificationTab; label: string }[] = [
  { id: "ALL", label: "Tất cả" },
  { id: "UNREAD", label: "Chưa đọc" },
  { id: "WORKFLOW", label: "Phê duyệt" },
  { id: "CONTRACT", label: "Hợp đồng" },
  { id: "RECRUITMENT", label: "Tuyển dụng" },
  { id: "PAYROLL", label: "Tiền lương" },
  { id: "ANNOUNCEMENT", label: "Chung & Sự kiện" },
  { id: "SYSTEM", label: "Hệ thống" },
];

