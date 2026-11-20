"use client";

import React from "react";
import { Calendar, PlayCircle, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PerformanceCycleDto } from "../../types/performance.types";

interface CycleStatsCardsProps {
  cycles: PerformanceCycleDto[];
  selectedStatus?: string;
  onFilterStatus?: (status: string | undefined) => void;
  isLoading?: boolean;
}

export function CycleStatsCards({
  cycles,
  selectedStatus,
  onFilterStatus,
  isLoading,
}: CycleStatsCardsProps) {
  const total = cycles.length;
  const activeCount = cycles.filter((c) => c.status === "ACTIVE").length;
  const closedCount = cycles.filter((c) => c.status === "CLOSED").length;
  const draftCount = cycles.filter((c) => c.status === "DRAFT").length;

  const stats = [
    {
      label: "Tổng số kỳ đánh giá",
      count: total,
      icon: Calendar,
      iconBg: "bg-primary text-white",
      sparkColor: "#DC2626",
      sparkPath: "M0,35 Q25,38 50,22 T100,8",
      statusKey: "ALL",
    },
    {
      label: "Đang mở đánh giá",
      count: activeCount,
      icon: PlayCircle,
      iconBg: "bg-emerald-600 text-white",
      sparkColor: "#10B981",
      sparkPath: "M0,32 Q30,15 60,28 T100,10",
      statusKey: "ACTIVE",
    },
    {
      label: "Đã hoàn tất / Đóng kỳ",
      count: closedCount,
      icon: CheckCircle2,
      iconBg: "bg-blue-600 text-white",
      sparkColor: "#3B82F6",
      sparkPath: "M0,38 Q30,42 60,18 T100,5",
      statusKey: "CLOSED",
    },
    {
      label: "Kỳ dự thảo (Draft)",
      count: draftCount,
      icon: Clock,
      iconBg: "bg-amber-500 text-white",
      sparkColor: "#F59E0B",
      sparkPath: "M0,28 Q35,12 70,25 T100,15",
      statusKey: "DRAFT",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
      {stats.map((item) => {
        const Icon = item.icon;
        const isSelected =
          (!selectedStatus && item.statusKey === "ALL") ||
          selectedStatus === item.statusKey;

        return (
          <div
            key={item.label}
            onClick={() => {
              if (!onFilterStatus) return;
              if (item.statusKey === "ALL") {
                onFilterStatus(selectedStatus === "ALL" ? undefined : "ALL");
              } else {
                onFilterStatus(selectedStatus === item.statusKey ? "ALL" : item.statusKey);
              }
            }}
            className={cn(
              "flex items-center justify-between rounded-xl border p-4 sm:p-5 shadow-xs transition-all cursor-pointer group bg-card",
              isSelected
                ? "border-primary ring-2 ring-primary/20 bg-primary/5 shadow-sm"
                : "border-border hover:border-primary/40 hover:shadow-md"
            )}
          >
            <div className="flex items-center gap-3.5">
              <div
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-xs transition-transform group-hover:scale-105",
                  item.iconBg
                )}
              >
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  {item.label}
                </p>
                <h3 className="text-2xl font-bold tracking-tight text-foreground font-mono mt-0.5">
                  {isLoading ? "..." : item.count}
                </h3>
              </div>
            </div>

            <div className="h-9 w-20 shrink-0 opacity-75 group-hover:opacity-100 transition-opacity">
              <svg viewBox="0 0 100 45" className="h-full w-full overflow-visible">
                <path
                  d={item.sparkPath}
                  fill="none"
                  stroke={item.sparkColor}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}
