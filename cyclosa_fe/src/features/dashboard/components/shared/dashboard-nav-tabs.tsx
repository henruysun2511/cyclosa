"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Clock,
  UserPlus,
  Award,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const DASHBOARD_TABS = [
  {
    href: "/dashboard/overview",
    label: "Tổng quan điều hành",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/personnel",
    label: "Nhân sự & Hợp đồng",
    icon: Users,
  },
  {
    href: "/dashboard/attendance",
    label: "Chấm công & Ca kíp",
    icon: Clock,
  },
  {
    href: "/dashboard/recruitment",
    label: "Tuyển dụng & Hội nhập",
    icon: UserPlus,
  },
  {
    href: "/dashboard/performance",
    label: "Hiệu suất & Đánh giá",
    icon: Award,
  },
  {
    href: "/dashboard/workplace",
    label: "Không gian & Tài sản",
    icon: Building2,
  },
];

export function DashboardNavTabs({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <div className={cn("w-full overflow-x-auto scrollbar-none pb-1", className)}>
      <nav className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-border min-w-max">
        {DASHBOARD_TABS.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex items-center gap-2 px-3.5 py-1.5 text-xs rounded-lg transition-all whitespace-nowrap",
                isActive
                  ? "bg-primary text-white font-semibold shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-foreground hover:bg-white/80 dark:hover:bg-slate-700/80 font-medium"
              )}
            >
              <Icon className={cn("h-3.5 w-3.5", isActive ? "text-white" : "text-muted-foreground")} />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
