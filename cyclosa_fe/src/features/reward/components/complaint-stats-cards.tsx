"use client";

import React from "react";
import { MessageSquareWarning, Inbox, Search, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Complaint } from "../types/reward.types";

interface ComplaintStatsCardsProps {
  items: Complaint[];
  totalElements?: number;
  selectedStatus?: string;
  onFilterStatus?: (status: string | undefined) => void;
}

export function ComplaintStatsCards({
  items,
  totalElements,
  selectedStatus,
  onFilterStatus,
}: ComplaintStatsCardsProps) {
  const total = totalElements ?? items.length;
  const openCount = items.filter((i) => i.status === "OPEN").length;
  const investigatingCount = items.filter((i) => i.status === "INVESTIGATING").length;
  const resolvedCount = items.filter(
    (i) => i.status === "RESOLVED" || i.status === "CLOSED"
  ).length;

  const stats = [
    {
      key: "ALL",
      title: "Tổng khiếu nại & phản ánh",
      value: total,
      sub: "Toàn bộ hệ thống",
      icon: MessageSquareWarning,
      boxColor: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
      valueColor: "text-foreground",
      sparkColor: "#3B82F6",
      sparkPath: "M0,32 Q25,38 50,20 T100,10",
    },
    {
      key: "OPEN",
      title: "Chờ tiếp nhận xử lý",
      value: openCount,
      sub: "Đơn mới gửi cần phân công",
      icon: Inbox,
      boxColor: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
      valueColor: "text-amber-600 dark:text-amber-400",
      sparkColor: "#F59E0B",
      sparkPath: "M0,28 Q35,12 70,25 T100,15",
    },
    {
      key: "INVESTIGATING",
      title: "Đang thụ lý xác minh",
      value: investigatingCount,
      sub: "HR đang thanh tra / giải quyết",
      icon: Search,
      boxColor: "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400",
      valueColor: "text-indigo-600 dark:text-indigo-400",
      sparkColor: "#6366F1",
      sparkPath: "M0,35 Q30,42 60,18 T100,12",
    },
    {
      key: "RESOLVED",
      title: "Đã giải quyết thỏa đáng",
      value: resolvedCount,
      sub: "Đã có kết luận & đóng hồ sơ",
      icon: CheckCircle2,
      boxColor: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
      valueColor: "text-emerald-600 dark:text-emerald-400",
      sparkColor: "#10B981",
      sparkPath: "M0,30 Q30,15 60,28 T100,8",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;
        const isSelected = selectedStatus === item.key;

        return (
          <div
            key={item.key}
            onClick={() => {
              if (onFilterStatus) {
                onFilterStatus(isSelected ? undefined : item.key);
              }
            }}
            className={cn(
              "relative overflow-hidden flex items-center justify-between p-5 rounded-xl border border-border bg-card shadow-xs hover:border-primary/20 transition-all duration-200",
              onFilterStatus && "cursor-pointer",
              isSelected && "ring-2 ring-primary border-primary bg-primary/5"
            )}
          >
            {/* SVG Sparkline mờ chìm góc dưới */}
            <div className="absolute right-0 bottom-0 w-28 h-12 opacity-15 pointer-events-none">
              <svg viewBox="0 0 100 40" className="w-full h-full preserve-3d">
                <path
                  d={item.sparkPath}
                  fill="none"
                  stroke={item.sparkColor}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Cột trái: Tiêu đề + Giá trị + Phụ đề */}
            <div className="space-y-1 z-10">
              <p className="text-xs font-medium text-muted-foreground">{item.title}</p>
              <p className={cn("text-2xl font-bold tracking-tight", item.valueColor)}>
                {item.value}
              </p>
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[11px] font-medium text-muted-foreground">
                  {item.sub}
                </span>
              </div>
            </div>

            {/* Cột phải: Icon Box chuẩn h-12 w-12 rounded-xl */}
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-xl shrink-0 z-10 transition-transform duration-200 group-hover:scale-105",
                item.boxColor
              )}
            >
              <Icon className="h-6 w-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
